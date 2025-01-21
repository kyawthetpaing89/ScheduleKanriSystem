const _service = new Service();
const _urlLoginCheck = '/api/member/logincheck';

$(() => {
    config();
    action();
});

const config = () => {

}

const action = () => {
    $('#btnLogin').on('click', login);
}

const login = () => {

    const _tenantID = _service.getTanentID();

    const _model = {
        TenantID: _tenantID,
        Email: $('#txtEmail').val(),
        Password: $('#txtPassword').val(),
    }

    axios.post(_urlLoginCheck, _model).then(response => {
        localStorage.setItem(`${_tenantID}_jwtToken`, response.data.token);
        localStorage.setItem(`${_tenantID}_userID`, response.data.data.UserID);
        localStorage.setItem(`${_tenantID}_userName`, response.data.data.UserName);
        localStorage.setItem(`${_tenantID}_ProfilePhoto`, response.data.data.ProfileImage);

        location.href = `/${_tenantID}/Member/MemberList`;
    }).catch(error => {
        console.log(error);
        _service.loadtoast('error', error.response.data.data.message);
    });
}
