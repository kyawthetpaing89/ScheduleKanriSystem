const _service = new Service();
const _urlGetMember = '/api/member/getmember';
const _urlMemberProcess = '/api/member/memberprocess';
const _urlMemberDelete = '/api/member/memberdelete';

var tblMember;

const _membermodel = [
    { selector: '#txtUserID', name: "User ID", model: "UserID" },
    { selector: '#txtRegisterDate', model: "CreatedDate" },
    { selector: '#txtName', name: "User Name", required: true, model: "UserName" },
    { selector: '#txtEmail', name: "Email", required: true, model: "Email" },
    { selector: '#ddlPosition', name: "Position", required: true, model: "Position" },
    { selector: '#txtPassword', name: "Password", required: true, model: "Password" },
    { selector: 'rdoUserRole', isradio : true, model: "UserRole" },
    { selector: '#txtMobileNo', name: "Mobile No", required: true, model: "MobileNumber" },
];

$(() => {
    config();
    action();
});

const config = () => {
    loadMemberList();
}

const action = () => {
    $('#btnBack').on('click', goBack);
    $('#btnSave').on('click', saveMember);
    $('#btnDelete').on('click', deleteMember);
    $('#imgProfile').on('click', imgProfileClick);
    $('#fileInput').on('change', profileImageChange);
    $('#tblMember').off('click', '.table-edit').on('click', '.table-edit', (event) => loadMember('Edit', event));
}

const goBack = () => {
    $('#divEntry').hide();
    $('#divList').show();

    loadMemberList();
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
        {
            "data": "ProfileImage", className: "text-center align-middle",
            render: (data, type, row) => {
                const currentDatetime = new Date().toISOString();
                if (data) {
                    return `<image class="imgcircle" src="/images/profile/${row.ProfileImage}?v=${currentDatetime}" />`
                } else {
                    return `<image class="imgcircle" src="/images/profile/default.png" />`
                }
                
            }
        },
        { "data": "Position", className: "text-center align-middle" },
        { "data": "UserRole", className: "text-center align-middle" },
        {
            "data": "CreatedDate", className: "text-center align-middle",
            render: (data, type) => {
                if (!data) return '';
                if (type === 'display' || type === 'filter') {
                    return _service.formatteddate(data);
                }
                return data;
            }
        },
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

            $('#tblMember_wrapper .dt-buttons').append(
                `
                <button id="btnNewMember" class="btn btn-info mb10 mr5">New Member</button>
                <button id="btnExport" class="btn btn-success mb10 ml10"><i class="bi bi-file-earmark-excel"></i></button>
                `
            );

            $('#btnNewMember').off('click').on('click', () => loadMember('New'));

        });
}

const loadMember = (mode, event) => {
    $('#hfMode').val(mode);

    _service.clearmodel({ fields: _membermodel });
    $('#rdoAdmin').prop('checked', true);
    $('#fileInput').val('');

    let row;
    if (event) {
        row = tblMember.row($(event.target).closest('tr')).data();
        _service.setmodel({ fields: _membermodel, data: row });
        $('#imgProfile').attr('src', `/images/profile/${row.ProfileImage}`);
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

const saveMember = () => {
    if (!memberErrorCheck()) {
        return;
    }

    const file = $('#fileInput')[0].files[0];
    const formData = new FormData();
    formData.append('file', file); 

    const _tenantID = _service.getTanentID();

    const _model = _service.getmodel({ fields: _membermodel });
    _model["Mode"] = $('#hfMode').val();
    _model["TenantID"] = _tenantID;
    _model["CreatedBy"] = localStorage.getItem(`${_tenantID}_userID`);

    for (const key in _model) {
        if (_model.hasOwnProperty(key)) {
            formData.append(key, _model[key]);
        }
    }

    _service.uploadapicall(_urlMemberProcess, formData).then(response => {
        if (response.status == 200) {
            _service.loadtoast('success', `Saved Successfully!`);
            goBack();
        }
    });
}

const memberErrorCheck = () => {
    if (!_service.nullcheck({ fields: _membermodel })) return false;

    return true;
}

const deleteMember = () => {
    _service.confirmmessage('Are you sure you want to delete this member?').then(() => {

        const _tenantID = _service.getTanentID();

        const _model = {
            Mode: 'Delete',
            TenantID: _tenantID,
            UserID : $('#txtUserID').val(),
        };

        _service.apicall(_urlMemberDelete, _model).then(response => {
            if (response.status == 200) {
                _service.loadtoast('success', `Deleted Successfully!`);
                goBack();
            }
        });
    });
}

const imgProfileClick = () => {
    $('#fileInput').val('');
    $('#fileInput')[0].click();
}

const profileImageChange = () => {
    const file = $('#fileInput')[0].files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#imgProfile').attr('src', e.target.result); 
        };

        reader.readAsDataURL(file);
    }
}