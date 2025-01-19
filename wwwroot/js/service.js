class Service {
    getmodel = (setting) => {
        const _fields = setting.fields;
        const obj = {};
        _fields.forEach(field => {
            if (field.model !== "") {
                if (field.isradio) {
                    obj[field.model] = $(`input[name="${field.selector}"]:checked`).val();
                } else {
                    obj[field.model] = $(field.selector).val();
                }
            }
        });
        return obj;
    }

    clearmodel = (setting) => {
        setting.fields.forEach(field => {
            const $element = $(field.selector);

            if (field.isdate === true) {
                this.cleardate($element);
            } else if ($element.is('input[type="text"], input[type="hidden"], textarea')) {
                $element.val('');
            } else if ($element.is('select')) {
                this.ddldefault($element);  // Ensure this refers to the correct object
            }
        });
    }

    ddldefault = (selector) => {
        $(selector).val($(selector).find("option:first").val());
    }

    loadtoast = (icon, message) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })

        Toast.fire({
            icon: icon,
            title: message,
        })
    }

    isnullorempty = (value) => {
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === "");
    }

    apicall = (url, model) => {
        const _tenantID = this.getTanentID();
        console.log(_tenantID);
        const _token = localStorage.getItem(`${_tenantID}_jwtToken`);
        console.log(_token);

        if (this.isnullorempty(_token)) {
            console.error('Token is null or empty, redirecting to login.');

            location.href = `/0/Tenant/HomePage`;
            return;
        }

        return axios.post(url, model, {
            headers: {
                'Authorization': `Bearer ${_token}` // Include the token in the Authorization header
            }
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized: Token might be expired");
                //location.href = `/0/Tenant/HomePage`;
            } else {
                console.error('API call error:', error.response);
            }
        });
    }

    bindtable = (table, config) => {
        this.showtableloading(table);
        return this.apicall(config.url, config.model)
            .then((response) => {
                this.hidetableloading(table);
                let t1 = table.DataTable($.extend({
                    responsive: true,
                    data: response.data.data,
                }, config));

                return t1;
            });
    }

    showtableloading = (table) => {
        const tbl = table.attr('id')

        if ($.fn.DataTable.isDataTable(tbl)) {
            $(tbl).DataTable().clear().destroy();
        }

        // Clear any existing content in the table body
        $(tbl).find('tbody').remove();

        // Create the loading indicator HTML
        const spinnerHtml = `
            <div class="loading-icon">
                <i class="bi bi-cloud-arrow-down-fill"></i>
                <i class="bi bi-cloud-arrow-down-fill"></i>
                <i class="bi bi-cloud-arrow-down-fill"></i>
            </div>
        `;

        // Append the loading indicator to the table
        const loadingRowHtml = `<tbody><tr><td class="text-center" colspan="100">${spinnerHtml}</td></tr></tbody>`;
        table.append(loadingRowHtml);
    }

    hidetableloading = (table) => {
        const tbl = table.attr('id')
        $('#' + tbl + ' tbody').empty();
    }

    getTanentID = () => {
        let path = window.location.pathname;
        let parts = path.split('/');
        let tenantID = parts[1];

        return tenantID;
    }
}