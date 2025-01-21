$(() => {
    usersettingconfig();
});

const usersettingconfig = () => {
    const _tenantID = new Service().getTanentID();
    const _userName = localStorage.getItem(`${_tenantID}_userName`);
    const _profilephoto = localStorage.getItem(`${_tenantID}_ProfilePhoto`);
    const _currentDatetime = new Date().toISOString();

    $('.lblUserName').text(_userName);
    $('.imgmyprofile').attr('src', `/images/profile/${_profilephoto}?v=${_currentDatetime}`);

    $('#btnLogout').on('click', () => {

        localStorage.removeItem(`${_tenantID}_jwtToken`);
        localStorage.removeItem(`${_tenantID}_userID`);
        localStorage.removeItem(`${_tenantID}_userName`);
        localStorage.removeItem(`${_tenantID}_ProfilePhoto`);

        location.href = "http://localhost:5263/0/Tenant/HomePage"
    });
}