import { FormControl } from '@angular/forms';
import { Subject } from '@platform/env/subscription';
import { IFilter, IFilterFlags } from '@platform/types/filter';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import * as obj from '@platform/env/obj';

export class SearchInput {
    public control: FormControl = new FormControl();
    public ref!: HTMLInputElement;
    public value: string = '';
    public readonly: boolean = false;
    public focused: boolean = false;
    public recent: boolean = false;
    public flags: IFilterFlags = {
        word: false,
        cases: false,
        reg: true,
    };
    public actions: {
        drop: Subject<void>;
        clear: Subject<void>;
        accept: Subject<void>;
        recent: Subject<void>;
        edit: Subject<void>;
        flags: Subject<void>;
    } = {
        drop: new Subject(),
        clear: new Subject(),
        accept: new Subject(),
        recent: new Subject(),
        edit: new Subject(),
        flags: new Subject(),
    };
    private _prev: string = '';
    private _panel!: MatAutocompleteTrigger;

    public destroy() {
        this.actions.accept.destroy();
        this.actions.drop.destroy();
        this.actions.recent.destroy();
        this.actions.edit.destroy();
        this.actions.clear.destroy();
    }

    public bind(ref: HTMLInputElement, panel: MatAutocompleteTrigger) {
        this.control.setValue('');
        this.ref = ref;
        this._panel = panel;
    }

    public focus() {
        this.ref.focus();
    }

    public isEmpty(): boolean {
        return this.value.trim() === '';
    }

    public asFilter(): IFilter {
        return {
            filter: this.value,
            flags: this.flags,
        };
    }

    public keydown() {
        this._prev = this.control.value;
    }

    public keyup(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.recent = false;
            if (this.control.value.trim() !== '') {
                this.drop();
                this.actions.clear.emit();
            } else {
                this.actions.drop.emit();
            }
        } else if (event.key === 'Enter') {
            if (this.recent) {
                this.recent = false;
                this._panel.closePanel();
            }
            if (this.control.value.trim() === '') {
                this.drop();
                this.actions.drop.emit();
            } else {
                this.value = this.control.value;
                this.actions.accept.emit();
            }
        } else if (event.key === 'Backspace' && this.control.value === '' && this._prev === '') {
            this.actions.edit.emit();
        } else if (this.control.value !== '' && !this.recent) {
            this.recent = true;
            this._panel.openPanel();
            this.actions.recent.emit();
        }
    }

    public drop() {
        this.control.setValue('');
        this.value = '';
        this._prev = '';
    }

    public set(): {
        value(value: string | IFilter): void;
        caseSensitive(): void;
        wholeWord(): void;
        regex(): void;
    } {
        return {
            value: (value: string | IFilter): void => {
                if (typeof value === 'string') {
                    this.control.setValue(value);
                    this._prev = value;
                } else {
                    this.control.setValue(value.filter);
                    this.flags = obj.clone(value.flags);
                }
            },
            caseSensitive: () => {
                this.flags.cases = !this.flags.cases;
                this.actions.flags.emit();
            },
            wholeWord: () => {
                this.flags.word = !this.flags.word;
                this.actions.flags.emit();
            },
            regex: () => {
                this.flags.reg = !this.flags.reg;
                this.actions.flags.emit();
            },
        };
    }

    public onPanelClosed() {
        this.recent = false;
    }
}
