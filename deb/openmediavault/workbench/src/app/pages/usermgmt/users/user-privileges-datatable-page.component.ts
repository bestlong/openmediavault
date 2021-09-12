/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2021 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { marker as gettext } from '@biesbjerg/ngx-translate-extract-marker';
import * as _ from 'lodash';

import { DatatablePageComponent } from '~/app/core/components/intuition/datatable-page/datatable-page.component';
import { DatatablePageConfig } from '~/app/core/components/intuition/models/datatable-page-config.type';
import { format } from '~/app/functions.helper';
import { NotificationType } from '~/app/shared/enum/notification-type.enum';
import { NotificationService } from '~/app/shared/services/notification.service';
import { RpcService } from '~/app/shared/services/rpc.service';

@Component({
  template:
    '<omv-intuition-datatable-page #page [config]="this.config"></omv-intuition-datatable-page>'
})
export class UserPrivilegesDatatablePageComponent {
  @ViewChild('page', { static: true })
  page: DatatablePageComponent;

  public config: DatatablePageConfig = {
    stateId: '3752268a-27c1-11ea-a5b1-a3d1c7dcb22c',
    autoReload: false,
    limit: 0,
    icon: 'tip',
    subTitle: gettext(
      // eslint-disable-next-line max-len
      'These settings are used by the services to configure the access rights for the user "{{ _routeParams.name }}". Please note that these settings have no effect on file system permissions.'
    ),
    selectionType: 'none',
    columns: [
      { name: gettext('Shared folder'), prop: 'name', flexGrow: 1, sortable: true },
      {
        name: gettext('Permissions'),
        prop: 'perms',
        flexGrow: 1,
        sortable: true,
        cellTemplateName: 'buttonToogle',
        cellTemplateConfig: [
          {
            value: '7',
            text: gettext('Read/Write')
          },
          {
            value: '5',
            text: gettext('Read-only')
          },
          {
            value: '0',
            text: gettext('No access')
          }
        ]
      }
    ],
    sorters: [
      {
        dir: 'asc',
        prop: 'name'
      }
    ],
    store: {
      proxy: {
        service: 'ShareMgmt',
        get: {
          method: 'getPrivilegesByRole',
          params: {
            role: 'user',
            name: '{{ _routeParams.name }}'
          }
        }
      }
    },
    buttons: [
      {
        template: 'submit',
        click: this.onSave.bind(this)
      },
      {
        template: 'cancel',
        url: '/usermgmt/users'
      }
    ]
  };

  constructor(
    private router: Router,
    private rpcService: RpcService,
    private notificationService: NotificationService
  ) {}

  onSave() {
    const privileges = [];
    _.forEach(this.page.table.data, (row) => {
      const privilege = {
        uuid: _.get(row, 'uuid'),
        perms: _.toInteger(_.get(row, 'perms'))
      };
      if (_.isNull(privilege.perms)) {
        privilege.perms = -1;
      }
      privileges.push(privilege);
    });
    this.rpcService
      .request('ShareMgmt', 'setPrivilegesByRole', {
        role: 'user',
        name: _.get(this.page.routeParams, 'name'),
        privileges
      })
      .subscribe(() => {
        this.notificationService.show(
          NotificationType.success,
          format(_.get(this.page.routeConfig, 'data.notificationTitle'), this.page.routeParams)
        );
        this.router.navigate(['/usermgmt/users']);
      });
  }
}
