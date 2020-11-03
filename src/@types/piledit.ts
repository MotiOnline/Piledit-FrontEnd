export type Position = {
  x: number
  y: number
}

// Block-type
// name: string ブロック名, Debug, DefinitionComponent など
// uuid: 固有ID
// topUuid: 親子関係の頂点Blockの固有ID
// parentUuid: 直上Blockの固有ID
// childUuid: 直下Blockの固有ID
// shadow: Block-Shadowの表示有無
// position: 座標
export type Block = {
  name: string
  uuid: string
  topUuid: string
  parentUuid: string
  childUuid: string
  shadow: boolean
  position: Position
}

export type BlockComponent = {
  blockComponentUniqueKey: string
  blocks: { [ key: string ]: Block }
}

export type ComponentObject = {
  componentObjectUniqueKey: string
  componentUniqueKey: string
  position: Position
  width: number
}

export type Tab = {
  name: string
  uuid: string
}