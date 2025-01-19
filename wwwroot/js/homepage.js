const _service = new Service();
const _urlTenantCheck = '/api/tenant/tenantcheck';

$(() => {
    config();
    action();
});

const config = () => {

}

const action = () => {
    $('#btnTenantLogin').on('click', tenantLogin);
}

const tenantLogin = () => {
    const _model = {
        TenantID: $('#txtTenantID').val(),
    };

    axios.post(_urlTenantCheck, _model).then(response => {
        location.href = `/${$('#txtTenantID').val() }/Member/MemberLogin`;
    }).catch(error => {
        console.log(error.response);
    });
}