

$(() => {
    navaction();
});

const navaction = () => {
    $('#navDutyTable').on('click', () => goToNav('DutyPlan/DutyPlanTable'));
    $('#navUserList').on('click', () => goToNav('Member/MemberList'));
}

const goToNav = (url) => {
    const _tenantID = new Service().getTanentID();
    location.href = `/${_tenantID}/${url}`;
}