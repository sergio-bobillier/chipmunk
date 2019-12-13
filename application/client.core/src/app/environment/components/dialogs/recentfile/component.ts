import { Component, ChangeDetectorRef, Input, AfterContentInit } from '@angular/core';
import * as Toolkit from 'chipmunk.client.toolkit';
import ElectronIpcService, { IPCMessages, Subscription } from '../../../services/service.electron.ipc';
import FileOpenerService from '../../../services/service.file.opener';
import TabsSessionsService from '../../../services/service.sessions.tabs';
import { NotificationsService, INotification } from '../../../services.injectable/injectable.service.notifications';
import { ControllerSessionTab } from '../../../controller/controller.session.tab';

@Component({
    selector: 'app-views-dialogs-recentfilescation-map',
    templateUrl: './template.html',
    styleUrls: ['./styles.less']
})

export class DialogsRecentFilesActionComponent implements AfterContentInit {

    public _ng_files: Array<IPCMessages.IRecentFileInfo> = [];
    public _files: Array<IPCMessages.IRecentFileInfo> = [];
    private _logger: Toolkit.Logger = new Toolkit.Logger('DialogsRecentFilesActionComponent');

    @Input() close: () => void = () => {};

    constructor(private _cdRef: ChangeDetectorRef,
                private _notificationsService: NotificationsService) {
        this._ng_onFilterChange = this._ng_onFilterChange.bind(this);
    }

    public ngAfterContentInit() {
        ElectronIpcService.request(new IPCMessages.FilesRecentRequest(), IPCMessages.FilesRecentResponse).then((response: IPCMessages.FilesRecentResponse) => {
            if (response.error !== undefined) {
                this._logger.error(`Fail to get list of recent files due error: ${response.error}`);
                return;
            }
            this._ng_files = response.files.map((file: IPCMessages.IRecentFileInfo) => {
                if (file.filename === undefined) {
                    file.filename = Toolkit.basename(file.file);
                }
                if (file.folder === undefined) {
                    file.folder = Toolkit.dirname(file.file);
                }
                return file;
            });
            this._files = this._ng_files.slice();
            this._cdRef.detectChanges();
        }).catch((error: Error) => {
            this._logger.error(`Fail to get list of recent files due error: ${error}`);
        });
    }

    public _ng_open(file: IPCMessages.IRecentFileInfo) {
        FileOpenerService.openFileByName(file.file).catch((openFileErr: Error) => {
            this._logger.error(`Fail to open new session due error: ${openFileErr.message}`);
            this._notificationsService.add({
                caption: 'Fail open file',
                message: `Fail to open file "${file.file}" due error: ${openFileErr.message}`
            });
        });
        this.close();
    }

    public _ng_getLocalTime(timestamp: number) {
        const date: Date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    public _ng_onFilterChange(value: string, event: KeyboardEvent) {
        const reg: RegExp | Error = Toolkit.regTools.createFromStr(value);
        if (reg instanceof Error) {
            this._ng_files = this._files.slice();
            this._cdRef.detectChanges();
            return;
        }
        this._ng_files = this._files.filter((file: IPCMessages.IRecentFileInfo) => {
            return file.filename.search(reg) !== -1 || file.folder.search(reg) !== -1;
        });
        this._cdRef.detectChanges();
    }

}
