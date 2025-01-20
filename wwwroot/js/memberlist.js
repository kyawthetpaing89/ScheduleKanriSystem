const _service = new Service();
const _urlGetMember = '/api/member/getmember';
var tblMember;

$(() => {
    config();
    action();
});

const config = () => {
    loadMemberList();
}

const action = () => {
    $('#btnNewMember').on('click', () => loadMember('New'));
    $('#btnBack').on('click', goBack);
}

const goBack = () => {
    $('#divEntry').hide();
    $('#divList').show();
}

const loadMemberList = () => {
    const _model = {
        TenantID: _service.getTanentID(),
    };

    const _columns = [
        {
            "data": null, className: "text-center align-middle",
            render: (data, type, row) => {
                return `<span>${row.UserID}</span><br><span>${row.UserName}</span>`;
            }
        },
        { "data": "ProfileImage", className: "text-left align-middle", },
        { "data": "Position", className: "align-middle" },
        { "data": "CreatedDate", className: "text-right align-middle" },
        {
            "data": null, className: "text-center v-center",
            render: () => {
                return `<i class="table-icon bi bi-pencil-square table-edit"></i>`
            }
        }
    ];

    _service.bindtable($('#tblMember'), { buttons: [], columns: _columns, url: _urlGetMember, model: _model })
        .then(r1 => {
            tblMember = r1;
        });
}

const loadMember = (mode, event) => {
    $('#hfMode').val(mode);

    let row;
    if (event) {
        row = tblMember.row($(event.target).closest('tr')).data();
    }

    switch (mode) {
        case 'New':
            $('#lblTitle').text('Member Registration');
            break;
        case 'Edit':
            $('#lblTitle').text('Member Edit');
            break;
    }

    $('#divEntry').show();
    $('#divList').hide();
}