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
}