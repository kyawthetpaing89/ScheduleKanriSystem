const _service = new Service();

const _urlGetDutyPlan = '/api/dutyplan/getdutyplan';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

var tblDuty;

$(() => {
    config();
    action();
});

const config = () => {
    setYearMonth();
}

const action = () => {
    $('#btnPrev').on('click', () => setYearMonth('prev'));
    $('#btnNext').on('click', () => setYearMonth('next'));
}

const setYearMonth = (type) => {
    switch (type) {
        case "prev":
            currentMonth--;
            if (currentMonth < 1) {
                currentMonth = 12;
                currentYear--;
            }
            break;
        case "next":
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
            break;

        default:
            currentYear = new Date().getFullYear();
            currentMonth = new Date().getMonth() + 1;
            break;
    }

    $('.lblYear').text(currentYear);
    $('.lblMonth').text(String(currentMonth).padStart(2, '0')).val(String(currentMonth).padStart(2, '0'));

    $('#tblDuty').empty();

    $('#tblDuty').append('<thead></thead>');
    $('#tblDuty').append('<tbody></tbody>');

    loadTableHeader();
    loadTableBody();
}

const loadTableHeader = () => {
    const _totalDays = new Date(currentYear, currentMonth, 0).getDate();

    let headerRow1 = '<tr><th rowspan="3">Member : 10</th>';
    for (let i = 1; i <= _totalDays; i++) {
        const date = new Date(currentYear, currentMonth - 1, i);
        const dayOfWeek = date.getDay();
        const dayTextJapanese = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
        headerRow1 += `<th>${dayTextJapanese}</th>`;
    }
    headerRow1 += '</tr>';

    let headerRow2 = '<tr>';
    for (let i = 1; i <= _totalDays; i++) {
        headerRow2 += `<th>${i}</th>`;
    }
    headerRow2 += '</tr>';

    let headerRow3 = '<tr>';
    for (let i = 1; i <= _totalDays; i++) {
        headerRow3 += `<th class="d${i}_totalMember">0</th>`;
    }
    headerRow3 += '</tr>';

    $('#tblDuty thead').append(headerRow1 + headerRow2 + headerRow3);
}

const loadTableBody = () => {
    const _model = {
        TenantID: _service.getTanentID(),
        YYYY: `${currentYear}`,
        MM: `${currentMonth}`,
    }

    _service.apicall(_urlGetDutyPlan, _model).then(response => {
        const _data = response.data.data

        const _distinctData = [...new Set(_data.map(item => item.UserID))]
            .map(userID => {
                return _data.find(item => item.UserID === userID);
            })
            .sort((a, b) => a.UserName.localeCompare(b.UserName));

        _distinctData.forEach(distinctuser => {
            let bodyRow = `<tr><td>
                            <div class="td-userinfo">
                                <img src="/images/profile/${distinctuser.ProfileImage}" />
                                ${distinctuser.UserName}
                                <button class="btn btn-sm"><i class="bi bi-calendar3"></i></button>
                            </div></td>`;

            const _filteredData = _data.filter(item => item.UserID === distinctuser.UserID);
            const _totalDays = new Date(currentYear, currentMonth, 0).getDate(); 

            for (let i = 1; i <= _totalDays; i++) {
                const hasDuty = _filteredData.some(user => user.DutyDay === i); // check if user has duty on that day

                let td = `<td></td>`;
                if (hasDuty) {
                    td = `<td><div class="duty"></div></td>`;
                }

                bodyRow += td;
            }

            bodyRow += '</tr>';

            $('#tblDuty tbody').append(bodyRow);
        });
    });
}