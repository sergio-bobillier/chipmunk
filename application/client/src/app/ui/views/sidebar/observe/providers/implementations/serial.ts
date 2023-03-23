import { Provider as Base } from '../provider';
import { ObserveSource } from '@service/session/dependencies/observe/source';
import { IComponentDesc } from '@elements/containers/dynamic/component';
import { List } from '../../lists/serial/component';
import { IMenuItem } from '@ui/service/contextmenu';
import { State, KEY } from '../../states/serial';

export class Provider extends Base<State> {
    private _sources: ObserveSource[] = [];

    public contextMenu(source: ObserveSource): IMenuItem[] {
        const items: IMenuItem[] = [];
        const observer = source.observer;
        if (observer !== undefined) {
            items.push({
                caption: 'Disconnect',
                handler: () => {
                    observer.abort().catch((err: Error) => {
                        this.logger.error(
                            `Fail to abort observing (serial listening): ${err.message}`,
                        );
                    });
                },
            });
        } else {
            items.push({
                caption: 'Connect',
                handler: () => {
                    this.repeat(source.source).catch((err: Error) => {
                        this.logger.error(`Fail to repeat: ${err.message}`);
                    });
                },
            });
        }
        return items;
    }

    public update(sources: ObserveSource[]): Provider {
        this._sources = sources.filter((source) => source.source.is().serial);
        return this;
    }

    public sources(): ObserveSource[] {
        return this._sources;
    }

    public getPanels(): {
        list(): {
            name(): string;
            desc(): string;
            comp(): IComponentDesc;
        };
        details(): {
            name(): string | undefined;
            desc(): string | undefined;
            comp(): IComponentDesc | undefined;
        };
        nocontent(): {
            name(): string | undefined;
            desc(): string | undefined;
            comp(): IComponentDesc | undefined;
        };
    } {
        return {
            list: (): {
                name(): string;
                desc(): string;
                comp(): IComponentDesc;
            } => {
                return {
                    name: (): string => {
                        return `Serial Connections`;
                    },
                    desc: (): string => {
                        return this._sources.length > 0 ? this._sources.length.toString() : '';
                    },
                    comp: (): IComponentDesc => {
                        return {
                            factory: List,
                            inputs: {
                                provider: this,
                            },
                        };
                    },
                };
            },
            details: (): {
                name(): string | undefined;
                desc(): string | undefined;
                comp(): IComponentDesc | undefined;
            } => {
                return {
                    name: (): string | undefined => {
                        return ``;
                    },
                    desc: (): string | undefined => {
                        return '';
                    },
                    comp: (): IComponentDesc | undefined => {
                        return undefined;
                    },
                };
            },
            nocontent: (): {
                name(): string | undefined;
                desc(): string | undefined;
                comp(): IComponentDesc | undefined;
            } => {
                return {
                    name: (): string | undefined => {
                        return undefined;
                    },
                    desc: (): string | undefined => {
                        return undefined;
                    },
                    comp: (): IComponentDesc | undefined => {
                        return undefined;
                    },
                };
            },
        };
    }

    public storage(): {
        get(): State;
        key(): string;
    } {
        return {
            get: (): State => {
                return new State();
            },
            key: (): string => {
                return KEY;
            },
        };
    }
}
