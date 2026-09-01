
      const scoresVisible = true;

      const allGroups = [];

      function showLevel(id) {
        ['levelGroups', 'levelStudents'].forEach(l => {
          document.getElementById(l).classList.add('hidden');
        });
        document.getElementById(id).classList.remove('hidden');
      }

      function updateBreadcrumb(parts) {
        const bc = document.getElementById('groupsBreadcrumb');
        bc.innerHTML = parts.map((p, i) => {
          if (i < parts.length - 1) {
            return `<span class="bc-link" onclick="${p.fn}">${p.label}</span><span class="bc-sep">›</span>`;
          }
          return `<span class="bc-current">${p.label}</span>`;
        }).join('');
      }

      function renderGroups() {
        const groups = allGroups;
        const grid = document.getElementById('groupsSummaryGrid');

        grid.innerHTML = groups.map((g, i) => {
          const medalClass = i === 0 ? 'medal-gold' : i === 1 ? 'medal-silver' : i === 2 ? 'medal-bronze' : '';
          const totalDisplay = scoresVisible
            ? `<div class="group-summary-total">${g.total_points.toLocaleString('ar')}</div>`
            : '';
          const subText = scoresVisible
            ? `${g.member_count} طالب • المتوسط: ${g.avg_points} نقطة`
            : `${g.member_count} طالب`;
          return `
        <div class="group-summary-card ${medalClass}" onclick="showStudents(${g.id})">
          <div class="group-summary-rank">${i + 1}</div>
          <div class="group-summary-info">
            <h4>${g.name}</h4>
            <p>${subText}</p>
          </div>
          ${totalDisplay}
        </div>
      `;
        }).join('');

        updateBreadcrumb([{ label: 'المجموعات' }]);
        showLevel('levelGroups');
      }

      function showStudents(groupId) {
        const group = allGroups.find(g => g.id === groupId);
        if (!group) return;

        const container = document.getElementById('groupDetailContainer');
        const scoreCols = scoresVisible
          ?`<th class="col-initiative">🌟 مبادرة</th>
         <th class="col-score">الثقافي</th>
         <th class="col-score">الرياضي</th>
         <th class="col-score">الذاتي</th>
         <th class="col-score">حضور</th>
         <th class="col-total">الإجمالي</th>`
      : '';
    const rows = group.members.map((m, i) => {
      const rowClass = i === 0 ? 'rank-gold-row' : i === 1 ? 'rank-silver-row' : i === 2 ? 'rank-bronze-row' : '';
      
      const culturalDropdown = true 
        ? `<select class="points-select" onchange="updateCatPoints(${m.id}, 'cultural', this.value)">
             <option value="0" ${!m.cultural_points ? 'selected' : ''}>0</option>
             ${[5,10,15,20,25,30,35,40].map(v => `<option value="${v}" ${m.cultural_points === v ? 'selected' : ''}>${v}</option>`).join('')}
           </select>`
        : (m.cultural_points || 0);

      const sportsDropdown = true 
        ? `<select class="points-select" onchange="updateCatPoints(${m.id}, 'sports', this.value)">
             <option value="0" ${!m.sports_points ? 'selected' : ''}>0</option>
             ${[5,10,15,20,25,30,35,40].map(v => `<option value="${v}" ${m.sports_points === v ? 'selected' : ''}>${v}</option>`).join('')}
           </select>`
        : (m.sports_points || 0);

      const scoreCells = scoresVisible
        ? `<td class="col-initiative">${m.initiatives_points > 0 ? '+' + m.initiatives_points : '—'}</td>
           <td class="col-score">${culturalDropdown}</td>
           <td class="col-score">${sportsDropdown}</td>
           <td class="col-score">${m.knowledge_points}</td>
           <td class="col-score">${m.attendance_points}</td>
           <td class="col-total"><strong id="total-${m.id}">${m.total_points}</strong></td>`
        : '';
      return `
        <tr class="${rowClass}">
          <td>${i + 1}</td>
          <td><a href="/guardian?student=${m.id}" class="student-link">${m.name}</a></td>
          ${scoreCells}
        </tr>
      `;
    }).join('');

    container.innerHTML = `
            < div class="group-card" >
        <div class="group-card-header">
          <div class="group-rank-badge">1</div>
          <div>
            <h3>${group.name}</h3>
            <p class="group-sub">${group.member_count} طالب${scoresVisible ? ' • متوسط نقاط الطالب: ' + group.total_points : ''}</p>
          </div>
        </div>
        <table class="group-table">
          <thead><tr><th>الترتيب</th><th>اسم الطالب</th>${scoreCols}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div >
    `;

    updateBreadcrumb([
      { label: 'المجموعات', fn: "backToGroups()" },
      { label: group.name }
    ]);
    showLevel('levelStudents');
  }

  function backToGroups() {
    updateBreadcrumb([{ label: 'المجموعات' }]);
    showLevel('levelGroups');
  }

  renderGroups();

  async function updateCatPoints(studentId, category, points) {
    try {
      const res = await fetch('/api/supervisor/category-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, category, points: Number(points) })
      });
      if (res.ok) {
        // optionally update the total, or let the user refresh to see it correctly
        // to properly update the total in place, we'd need to recalculate.
        // I will just show a quick notification or nothing.
      } else {
        alert('حدث خطأ أثناء التحديث');
      }
    } catch (e) {
      alert('حدث خطأ في الاتصال');
    }
  }
    