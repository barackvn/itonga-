/**********************************************************************************
*
*    Copyright (c) 2017-2019 MuK IT GmbH.
*
*    This file is part of MuK Documents Preview 
*    (see https://mukit.at).
*
*    MuK Proprietary License v1.0
*
*    This software and associated files (the "Software") may only be used 
*    (executed, modified, executed after modifications) if you have
*    purchased a valid license from MuK IT GmbH.
*
*    The above permissions are granted for a single database per purchased 
*    license. Furthermore, with a valid license it is permitted to use the
*    software on other databases as long as the usage is limited to a testing
*    or development environment.
*
*    You may develop modules based on the Software or that use the Software
*    as a library (typically by depending on it, importing it and using its
*    resources), but without copying any source code or material from the
*    Software. You may distribute those modules under the license of your
*    choice, provided that this license is compatible with the terms of the 
*    MuK Proprietary License (For example: LGPL, MIT, or proprietary licenses
*    similar to this one).
*
*    It is forbidden to publish, distribute, sublicense, or sell copies of
*    the Software or modified copies of the Software.
*
*    The above copyright notice and this permission notice must be included
*    in all copies or substantial portions of the Software.
*
*    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
*    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
*    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
*    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
*    DEALINGS IN THE SOFTWARE.
*
**********************************************************************************/

odoo.define('muk_dms_preview.FileKanbanController', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var field_utils = require('web.field_utils');

var PreviewDialog = require('muk_preview.PreviewDialog');
var PreviewManager = require('muk_preview.PreviewManager');
var FileKanbanController = require('muk_dms.FileKanbanController');

var _t = core._t;
var QWeb = core.qweb;

FileKanbanController.include({
	custom_events: _.extend({}, FileKanbanController.prototype.custom_events, {
		kanban_preview: '_onKanbanPreview',
    }),
    _onKanbanPreview: function (event) {
    	var state = this.model.get(this.handle);
    	var data = _.map(state.data, function(record) {
    		var last_update =  record.data.__last_update;
            var unique = field_utils.format.datetime(last_update);
    		var download_url = session.url('/web/content', {
                unique: unique ? unique.replace(/[^0-9]/g, '') : null,
                filename: record.data.name,
                filename_field: 'name',
                model: 'muk_dms.file',
                id: record.data.id,
                field: 'content',
                download: true,
            });
    		return {
    			url: download_url,
    			filename: record.data.name,
    			mimetype: record.data.mimetype,
    		};
    	});
    	var index = _.findIndex(state.data, function(record) {
    		return event.data.res_id === record.data.id;
    	});
    	var preview = new PreviewDialog(
    		this, data, index
        );
        preview.appendTo(this.$('.mk_file_kanban_view'));
    	event.stopPropagation();
    },
});

});
