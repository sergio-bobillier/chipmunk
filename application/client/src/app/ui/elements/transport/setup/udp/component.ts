import { Component, ChangeDetectorRef, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Ilc, IlcInterface } from '@env/decorators/component';
import { ChangesDetector } from '@ui/env/extentions/changes';
import { State } from './state';
import { Action } from '@ui/tabs/sources/common/actions/action';
import { Subject } from '@platform/env/subscription';

@Component({
    selector: 'app-transport-udp',
    templateUrl: './template.html',
    styleUrls: ['./styles.less'],
})
@Ilc()
export class TransportUdp extends ChangesDetector implements OnDestroy, AfterViewInit {
    @Input() public state!: State;
    @Input() public action!: Action;
    @Input() public update?: Subject<void>;

    constructor(cdRef: ChangeDetectorRef) {
        super(cdRef);
    }

    public ngOnDestroy(): void {
        this.state.destroy();
    }

    public ngAfterViewInit(): void {
        this.update !== undefined && this.env().subscriber.register(
            this.update.subscribe(() => {
                this.detectChanges();
                this.verify();
            }),
        );
        this.env().subscriber.register(
            this.state.subjects.get().updated.subscribe(this.verify.bind(this)),
        );
        this.verify();
    }

    public ngAddMulticast() {
        this.state.addMulticast();
    }

    public ngOnRemoveMulticast(index: number) {
        this.state.cleanMulticast(index);
    }

    public verify() {
        this.action.setDisabled(!this.state.isValid());
    }
}
export interface TransportUdp extends IlcInterface {}
