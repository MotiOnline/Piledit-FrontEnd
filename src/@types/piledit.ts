export type PPosition = {
  x: number;
  y: number;
}

export interface PProjectIF {
  name: string;
  uuid: string;
}

export class PProject implements PProjectIF {
  public name: string;
  public uuid: string;

  constructor (context: Partial<PBlockBase>) {
    this.name = context.name!
    this.uuid = context.uuid!
  }
}

export type PProjects = {
  [key: string]: PProject;
}

export interface PBlockIF {
  name: string;
  kind: PBlockKind;
  uuid: string;
  topUuid: string;
  parentUuid: string;
  childUuid: string;
  shadow: boolean;
  position: PPosition;
  tabUuid: string;
  path: string;
  shadowPath: string;
  strokeColor: string;
  fillColor: string;
  isSample: boolean;
}

export enum PBlockKind {
  DebugBlock = 'DebugBlock',
  DefineComponentBlock = 'DefineComponentBlock',
  MovieLoadingBlock = 'MovieLoadingBlock',
  GrayScaleFilterBlock = 'GrayScaleFilterBlock',
  BlurFilterBlock = 'BlurFilterBlock'
}

enum PBlockSize {
  xShort = 200,
  short = 250,
  medium = 300,
  long = 350,
  xLong = 400
}

function basicBlockPath (width: number) {
  return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
}

function onlyParentBlockPath (width: number) {
  return `m 0,0 c 25,-22 71,-22 96,0 H ${width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
}

export function blockParameter (kind?: PBlockKind) {
  if (kind === PBlockKind.DebugBlock) {
    const path = basicBlockPath(PBlockSize.long)
    const strokeColor = '#c53d43'
    const fillColor = '#e83929'
    return { path, strokeColor, fillColor }
  } else if (kind === PBlockKind.DefineComponentBlock) {
    const path = onlyParentBlockPath(PBlockSize.medium)
    const strokeColor = '#bd9900'
    const fillColor = '#e3b100'
    return { path, strokeColor, fillColor }
  } else if (kind === PBlockKind.MovieLoadingBlock) {
    const path = basicBlockPath(PBlockSize.medium)
    const strokeColor = '#ff7f1e'
    const fillColor = '#ffa02c'
    return { path, strokeColor, fillColor }
  } else if (kind === PBlockKind.GrayScaleFilterBlock) {
    const path = basicBlockPath(PBlockSize.medium)
    const strokeColor = '#2f2f2f'
    const fillColor = '#3e3e3e'
    return { path, strokeColor, fillColor }
  } else if (kind === PBlockKind.BlurFilterBlock) {
    const path = basicBlockPath(PBlockSize.medium)
    const strokeColor = '#601b7d'
    const fillColor = '#79219c'
    return { path, strokeColor, fillColor }
  } else {
    throw new Error('登録されていないBlockです')
  }
}

class PBlockBase implements PBlockIF {
  public name: string
  public kind: PBlockKind
  public uuid: string
  public topUuid: string
  public parentUuid: string
  public childUuid: string
  public shadow: boolean
  public position: PPosition
  public tabUuid: string
  public path: string
  public shadowPath: string
  public strokeColor: string
  public fillColor: string
  public isSample: boolean

  constructor (context: Partial<PBlockBase>) {
    this.name = context.name!
    this.kind = context.kind!
    this.uuid = context.uuid!
    this.topUuid = context.topUuid!
    this.parentUuid = context.parentUuid!
    this.childUuid = context.childUuid!
    this.shadow = context.shadow!
    this.position = context.position!
    this.tabUuid = context.tabUuid!
    this.isSample = context.isSample!
    this.shadowPath = ''
    const { path, strokeColor, fillColor } = blockParameter(context.kind)
    this.path = path
    this.strokeColor = strokeColor
    this.fillColor = fillColor
  }
}

export class TDebugBlock extends PBlockBase {}

export class TDefineComponentBlock extends PBlockBase {
  public componentName?: string = undefined
}

export class TMovieLoadingBlock extends PBlockBase {
  public materialPath?: string = undefined
}

export enum GrayScaleFilterMode {
  Invalid,
  BasedOnR,
  BasedOnG,
  BasedOnB
}

export class TGrayScaleFilterBlock extends PBlockBase {
  public value?: number = undefined
  public inversion?: boolean = undefined
  public mode?: GrayScaleFilterMode = undefined
}

export class TBlurFilterBlock extends PBlockBase {}

export type PBlock =
  TDebugBlock |
  TDefineComponentBlock |
  TMovieLoadingBlock |
  TGrayScaleFilterBlock |
  TBlurFilterBlock

export type PBlocks = {
  [key: string]: PBlock;
}

export interface PComponentIF {
  uuid: string;
  name: string;
  blocks: PBlocks;
  exportBlocks: PBlocks; // exportBlocksがComponentのBlocksとして扱われる
}

export class PComponent implements PComponentIF {
  public uuid: string
  public name: string
  public blocks: PBlocks
  public exportBlocks: PBlocks

  constructor (uuid: string) {
    this.uuid = uuid
    this.name = ''
    this.blocks = {}
    this.exportBlocks = {}
  }
}

export type PComponents = {
  [key: string]: PComponent;
}

export interface ClipIF {
  uuid: string;
  name: string;
  componentUuid: string;
  position: PPosition;
  width: number;
}

export class PClip implements ClipIF {
  public uuid: string
  public name: string
  public componentUuid: string
  public position: PPosition
  public width: number

  constructor (uuid: string, name: string, componentUuid: string, position: PPosition, width: number) {
    this.uuid = uuid
    this.name = name
    this.componentUuid = componentUuid
    this.position = position
    this.width = width
  }
}

export type PClips = {
  [key: string]: PClip;
}

export interface PTabHistoryIF {
  historyContainer: [PTabHistoryKind, string, string][];
  historyIndex: number;
  addPage (kind: PTabHistoryKind, title: string, url: string): void;
  forward (): void;
  backward (): void;
}

export interface PTabIF {
  uuid: string;
  history: PTabHistory;
}

export enum PTabHistoryKind {
  General,
  Projects
}

export class PTabHistory implements PTabHistoryIF {
  public historyContainer: [PTabHistoryKind, string, string][]
  public historyIndex: number

  constructor (kind: PTabHistoryKind, title: string, url: string) {
    this.historyContainer = [[kind, title, url]]
    this.historyIndex = 0
  }

  forward () {
    if (this.historyIndex === this.historyContainer.length - 1) return
    this.historyIndex++
  }

  addPage (kind: PTabHistoryKind, title: string, url: string) {
    this.historyContainer.length = this.historyIndex + 1
    this.historyContainer.push([kind, title, url])
    this.historyIndex++
  }

  backward () {
    if (this.historyIndex === 0) return
    this.historyIndex--
  }
}

export class PTab implements PTabIF {
  public uuid: string
  public history: PTabHistory

  constructor (uuid: string, kind: PTabHistoryKind, title: string, url: string) {
    this.uuid = uuid
    this.history = new PTabHistory(kind, title, url)
  }
}

export type PTabs = {
  [key: string]: PTab;
}
