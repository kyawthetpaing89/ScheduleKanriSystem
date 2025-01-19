const _service = new Service();
const _urlTenantProcess = '/api/tenant/tenantprocess';

const _tenantmodel = [
    { selector: '#txtTenantID', name: "Tenant ID", required: true, model: "TenantID" },
    { selector: '#txtCompanyName', name: "Company Name", required: true, model: "CompanyName" },
    { selector: '#txtEmail', name: "Email", required: true, model: "Email" },
    { selector: '#txtPassword', name: "Password", required: true, model: "Password" },
    { selector: '#txtName', name: "User Name", required: true, model: "UserName" },
    { selector: '#ddlPosition', name: "Position", model: "Position" },
    { selector: '#txtMobileNo', name: "Mobile Number", required: true, model: "MobileNo" },
];

$(() => {
    config();
    action();
});

const config = () => {

}

const action = () => {
    $('#btnNext').on('click', gotoStep2);
    $('#btnRegister').on('click', registerTenant);
}

const gotoStep2 = () => {
    $('#divStep1').hide();
    $('#divStep2').show();
}

const registerTenant = () => {
    const _model = _service.getmodel({ fields: _tenantmodel });

    axios.post(_urlTenantProcess, _model).then(response => {
        console.log(response);
    })
}