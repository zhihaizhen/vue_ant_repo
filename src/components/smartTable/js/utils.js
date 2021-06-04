export default {

    /**
     * 提取column的属性（确实情况下，可设置默认值）
     * @param {Object} $column 
     * @param {String} attr_name 
     * @param {*} default_value 
     */
     extractAttr: function($column, attr_name, default_value) {

        if ($column.hasOwnProperty(attr_name)) {
            return $column[attr_name];
        }

        if (default_value !== null && default_value !== undefined) {
            return default_value;
        }
    },

    
    /**
     * 某个属性值，是否被认定为bool类型的true
     */
    treateAsTrue: function(prop_value) {
        return prop_value === ' ' || prop_value === 'true' || prop_value === '1' || prop_value === true;
    },

    /**
     * 从上下文对象上，提取指定名称的方法，或者由纯字符串指定的匿名方法
     */
    validateMethod: function(method_name, context_obj) {
        
        // TODO
        return;
        if (typeof method_name == 'function') {
            return method_name;
        }
        else if (typeof method_name != 'string' || method_name.trim().length == 0) {
            return undefined;
        }
        else {
            let clean_name = method_name.trim();
            let method = context_obj[clean_name];
            if (typeof method == 'function') {
                return method;
            }
            try {
                let anonymous_method = eval(clean_name);
                if (typeof anonymous_method == 'function') {
                    return anonymous_method;
                }
                else {
                    console.error(`the string [${clean_name}] cannot be evaluated as an anonymous function`);
                    return undefined;
                }
            }
            catch(ex) {
                console.error(`exception happens from casting the string [${clean_name}] into an anonymous function`, ex);
                return undefined;
            }
        }
    },

    createColgroup() {

    }



}

