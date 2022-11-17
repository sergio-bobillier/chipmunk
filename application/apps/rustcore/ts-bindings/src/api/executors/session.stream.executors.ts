import { executor as SearchExecutor } from './session.stream.search.executor';
import { executor as MapExecutor } from './session.stream.map.executor';
import { executor as AssignExecutor } from './session.stream.observe.executor';
import { executor as ExportExecutor } from './session.stream.export.executor';
import { executor as ExportSearchExecutor } from './session.stream.export_search.executor';
import { executor as ExportRawExecutor } from './session.stream.export_raw.executor';
import { executor as ExportRawSearchExecutor } from './session.stream.export_raw_search.executor';
import { executor as ExtractExecutor } from './session.stream.extract.executor';
import { executor as NearestExecutor } from './session.stream.nearest.executor';

export const Executors = {
    search: SearchExecutor,
    map: MapExecutor,
    observe: AssignExecutor,
    export: ExportExecutor,
    exportSearch: ExportSearchExecutor,
    exportRaw: ExportRawExecutor,
    exportRawSearch: ExportRawSearchExecutor,
    extract: ExtractExecutor,
    nearest: NearestExecutor,
};
