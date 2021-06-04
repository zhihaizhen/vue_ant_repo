import utils from './utils';

/**
 * table列对象
 */
class TableColumn {

    /**
     * 是否为用户自定义排序规则
     */
    get isCustomSorting() {
        return typeof this.sortingMethod == 'function';
    }
    
    /**
     * 
     * @param {String} area 目标展示区域 left/center/right
     * @param {Object} table_context_obj table上下文对象
     * @param {Number} column_index 该列在集合当中的相对位置（起步计数为1）
     */
    constructor(area, table_context_obj, column_index) {

        this.area = area;
        /**
         * 表格的上下文对象
         */
        this._tableContextObj = table_context_obj;
        /**
         * 列位于所在集合的位置，起步计数为1
         */
        this.columnIdx = column_index;
    }

    /**
     * 计算一个列的宽度
     * @param {HTMLTableCellElement} $col 
     * @param {String} attr_name 
     * @param {Number} default_width 
     */
    _extractColWidth($col, attr_name, default_width) {

        var width = utils.extractAttr($col, attr_name, default_width);
        try {
            if (typeof width != 'number') {
                width = parseInt(width);
            }
            if (width < 0) {
                width = default_width;
            }
        }
        catch(ex) {
            width = default_width;
        }

        return width;
    }


    /**
     * 构建完整的列信息
     * @param {Object} $cell
     * @param {SmartTable} table_ref
     */
    compile($cell, table_ref) {

        // 列行为特征类型
        var col_type = utils.extractAttr($cell, 'type', '');

        var slotScope = utils.extractAttr($cell, 'scopedSlots');
        var slot_name = slotScope ? slotScope.customRender : '';

        /**
         * 是否为序号列
         */
        this.isIndexCol = col_type == table_ref.config.colType.index;

        /**
         * 是否为选择列
         */
        this.isCheckCol = col_type == table_ref.config.colType.check;

        /**
         * 是否为模版（插槽）列
         */
        this.isTemplateCol = slot_name && slot_name.length > 0;

        this.templateSlot = slot_name;

        // 是否为数据列
        var is_data_col = !this.isIndexCol && !this.isCheckCol;

        /**
         * 是否为数据列（非选择 & 非序号，包括普通数据列 & 模板列）
         */
        this.isDataCol = is_data_col;

        /**
         * 是否为单个数据字段绑定列（除其他所有列类型之外的列，为单字段绑定数据列）
         */
        this.isNormalCol = is_data_col;

        /**
         * 标题文字
         */
        this.headerText = utils.extractAttr($cell, 'label') || '';
        if (!this.headerText) {
            this.headerText = this.isIndexCol ? '序号' : this.isCheckCol ? '选择' : ('COL-' + this.columnIdx);
        }

        /**
         * 绑定数据字段的名称（针对所有《数据型》的列类型，都可作用）
         * 1. 针对普通数据列，作绑定字段 + 排序
         * 2. 针对模板列，作排序
         * 3. 针对程序化列，作排序
         */
        this.propName = utils.extractAttr($cell, 'prop');
        /**
         * 是否绑定了具体目标字段
         * 1. 普通列、模板列、编程列，都可绑定字段
         * 2. 序号列 & 选择列则不可绑定，指定了也无效
         */
        this.hasBound2Prop = typeof this.propName == 'string';
        var min_col_width = 20;
        var prop_fixed_width = this._extractColWidth($cell, 'fixed-width', 0);
        var prop_min_width = this._extractColWidth($cell, 'min-width', min_col_width);
        var prop_width = this._extractColWidth($cell, 'width', 100);

        /**
         * 是否为固定列宽
         */
        this.isFixedWidth = prop_fixed_width > 0;
        /**
         * 能够允许的，最小宽度
         */
        this.minWidth = this.isFixedWidth ? Math.max(prop_fixed_width, min_col_width) : prop_min_width;
        /**
         * 当前实际呈现状态的宽度
         */
        this.width = this.isFixedWidth ? Math.max(prop_fixed_width, min_col_width) : Math.max(prop_width, this.minWidth);
        /**
         * 由正常显示到隐藏（设置宽度为0）时，在被隐藏之前的宽度
         */
        this.lastWidth = this.width;
        /**
         * 单元格左中右对齐方式
         */
        this.align = utils.extractAttr($cell, 'align');
        /**
         * header/body/footer多个部分，对应位置的col定义
         */
        this.$mulCols = [document.createElement('col')];
        this.$mulCols.pop();
        /**
         * 是否在内容无法完整呈现时，显示省略号效果，并且鼠标hover事件时，显示完整内容的tooltip
         */
        this.overflowt = is_data_col && utils.treateAsTrue(utils.extractAttr($cell, 'overflowt'));

        if (this.isNormalCol && !this.hasBound2Prop) {

            console.log("exception--------", $cell);
            throw `the column <${$cell.label}> is a normal data column but has not bound to a property`;
        }

        var prop_sortable = utils.treateAsTrue(utils.extractAttr($cell, 'sortable'));
        var prop_sorting_method = utils.validateMethod(utils.extractAttr($cell, 'sorting-method'), this._tableContextObj);

        /**
         * 是否可进行排序
         * 1. 一般数据列可参与排序
         * 2. 指定了property的模板列，或指定了排序方法，可参与排序，否则不可以
         * 3. 指定了property的编程列，或指定了排序方法，可参与排序，否则不可以
         */
        this.sortable = is_data_col && prop_sortable && this.propName
                        || is_data_col && typeof prop_sorting_method == 'function';

        if (this.sortable && typeof prop_sorting_method == 'function') {

            /**
             * 用户指定的，对该列的排序方式
             */
            this.sortingMethod = prop_sorting_method;
        }

        var is_searchable = utils.treateAsTrue(utils.extractAttr($cell, 'searchable'));
        var is_summarizable = utils.treateAsTrue(utils.extractAttr($cell, 'summarizable'));

        /**
         * 是否可参与搜索
         */
        this.searchable = is_data_col && this.propName && is_searchable;

        /**
         * 是否参与汇总（仅对number数据有效）
         */
        this.summarizable = is_data_col && this.propName && is_summarizable;

        /**
         * 是否参与导出
         */
        this.exportable = is_data_col && utils.treateAsTrue(utils.extractAttr($cell, 'exportable', true));

        /**
         * 是否导出数据遵照UI呈现规则（仅对非模版内容有效）
         */
        var export_fmt = utils.validateMethod(utils.extractAttr($cell, 'export-formatter'), this._tableContextObj);

        // TODO
        if (typeof export_fmt == 'function') {
            
            /**
             * 1. [function] export formatter 用于导出数据时，对数据进行格式化；
             * 2. 函数调用参数列表 ([object] prop_value, [string] prop_name, [object] row_data)；
             * 3. 如果没有指定该格式化函数，则导出时将调用：用于UI显示格式函数formatter；
             * 4. 如果在 export formatter & formatter 都未指定的情况下，则导出时，遵循prop name指定的数据字段（并配合data cell option选项进行简单格式化）；
             * 5. 如果在 export formatter & formatter & prop name 都未指定的情况下，则该列将不会被导出；
             * 6. 不能导出的列：exportable为false的列 / 序号列 / 选择列；
             */
            this.exportFormatter = export_fmt;
        }

        if (this.isNormalCol) {

            /**
             * 一般数据列，数据展示选项
             */
            this.dataCellOption = {

                // 各个属性之间存在互斥或叠加关系

                thousands: utils.treateAsTrue(utils.extractAttr($cell, 'thousands')),
                thousandsInteger: utils.treateAsTrue(utils.extractAttr($cell, 'thousands-int')),
                percentage: utils.treateAsTrue(utils.extractAttr($cell, 'percentage')),
                // 仅对percentage格式化有效
                by100: utils.treateAsTrue(utils.extractAttr($cell, 'by100')),
                // 所有数据呈现有效
                precision: utils.extractAttr($cell, 'precision'),
            };
        }
    }

    /**
     * 编译为占位空列
     * @param {TableColumn} context_col
     */
    compile2Empty(context_col) {
        
        /**
         * 用于占位的空白列
         */
        this.isEmptyCol = true;
        this.headerText = context_col.headerText;
        this.isFixedWidth = context_col.isFixedWidth;
        this.width = context_col.width;
        this.lastWidth = context_col.width;
        this.minWidth = context_col.minWidth;
        this.align = context_col.align;
        /**
         * 该空白列映射到的实际列
         */
        this.mappedCol = context_col;
        this.$mulCols = [{}];
        this.$mulCols.pop();
    }

    /**
     * 1. 建立column对象到 <col> 及 <th> 元素的引用
     * 2. 一个column可对应上中下三部分的col元素
     * @param {HTMLTableColElement} $col <table>/<colgroup>/<col> 引用
     */
    addColRef($col) {
        this.$mulCols.push($col);
    }

    /**
     * 建立column对象到 header 对应列单元格元素的引用
     * @param {HTMLTableCellElement} $header_cell <table>/<thead>/<th> 引用
     */
    addHeaderCellRef($header_cell) {

        if (!($header_cell instanceof HTMLTableCellElement)) {
            throw new Error('<$header_cell> must be correct table header cell');
        }

        /**
         * 该列，位于标题栏对应位置的，标题单元格
         */
        this.$headerCell = $header_cell;
    }

    /**
     * 建立column对象到 footer 对应列单元格元素的引用
     * @param {HTMLTableCellElement} $footer_cell <table>/<tfoot>/<td> 引用
     */
    addFooterCellRef($footer_cell) {

        if (!($footer_cell instanceof HTMLTableCellElement)) {
            throw new Error('<$footer_cell> must be correct table cell');
        }

        /**
         * 该列，在汇总栏当中，对应的单元格
         */
        this.$footerCell = $footer_cell;
        /**
         * 该列汇总值
         */
        this.totalValue = 0;
    }

    /**
     * 获取列是否处于展示（可见）状态
     */
    isVisible() {
        return this.width > 0;
    }

    /**
     * 设置列是否可见
     * @param {Boolean} visible 可见标识
     */
    setVisible(visible) {

        if (this.$mulCols.length == 0) {
            console.error('set col element reference firstly');
            return;
        }

        if (visible === true) {
            this.width = this.lastWidth;
            this.$mulCols.forEach(each_col => { each_col.width = this.lastWidth; });
        }
        else {
            this.width = 0
            this.$mulCols.forEach(each_col => { each_col.width = 0; });
        }
    }

    /**
     * 设置该列宽度，于整个table的宽度，所占权重（0~1）
     * @param {Number} table_standard_width 
     */
    setWeight(table_standard_width) {

        /**
         * 列宽占整个表格宽度的权重
         */
        this.weight = this.isFixedWidth ? 0 : this.width / table_standard_width;
    }

    /**
     * 设置列宽
     * @param {Number} new_width 列宽 >= 0
     */
    resize(new_width) {

        if (this.$mulCols.length == 0) {
            console.error('set reference to col element(s) firstly');
            return;
        }
        
        if (new_width < 0) {
            console.error('can only set a positive value for column width');
            return;
        }
        else if (this.minWidth > 0 && new_width < this.minWidth) {
            console.error(`can not set column width to ${new_width}, the min width is ${this.minWidth}`);
            return;
        }
        
        this.width = new_width;
        this.lastWidth = new_width;
        this.$mulCols.forEach(each_col => { each_col.width = new_width; });
    }
}


export default TableColumn;