

$(() => {
    navaction();
});

const navaction = () => {
    $('#navDutyTable').on('click', () => goToNav('DutyPlan/DutyPlanTable'))
}

const goToNav = (url) => {
    const _tenantID = new Service().getTanentID();
    location.href = `/${_tenantID}/${url}`;
}