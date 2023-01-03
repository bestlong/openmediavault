/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2023 Volker Theile
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
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { Icon } from '~/app/shared/enum/icon.enum';

@Pipe({
  name: 'mapIconEnum'
})
export class MapIconEnumPipe implements PipeTransform {
  transform(value: string, defaultValue?: string): string {
    // Map icon from 'foo' to 'mdi:foo' if necessary.
    return _.get(Icon, value, defaultValue ?? value);
  }
}
