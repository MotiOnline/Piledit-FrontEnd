<template>
  <svg
    @mousedown.left="mouseDown($event)"
    @click.right.prevent="popupContextMenu($event)"
    preserveAspectRatio="xMidYMid meet"
    :x="position.x"
    :y="position.y"
    :id="uuid"
  >
    <path
      :d="path"
      :stroke="strokeColor"
      :fill="fillColor"
      stroke-width="2"
      transform="translate(1,1) scale(0.75, 0.75)"
    />
    <slot></slot>
    <path
      v-if="shadow"
      stroke-width="2"
      fill="#d3d3d8"
      :d="path"
      transform="translate(1,37) scale(0.75, 0.75)"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { Position } from '@/@types/piledit'
import svgZOrder from 'svg-z-order'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

// AbstractBlock classは、編集ブロックの抽象クラスです
// マウスイベントによる移動、クリックイベント、コピーなどブロックの最低限の機能を備えます
// 全ての編集ブロックはAbstractBlockコンポーネントを利用して作成します

@Component
export default class AbstractBlock extends Vue {
  // ブロック一覧にあるサンプルかどうか
  // サンプルなら、mouseUpでcopyし、編集可能範囲外でも自動削除しない
  @Prop({ required: true })
  public sampleBlock!: boolean

  @Prop({ required: true })
  public uuid!: string

  @Prop({ required: true })
  public position!: Position

  @Prop({ required: true })
  public shadow!: boolean

  @Prop({ required: true })
  public strokeColor!: string

  @Prop({ required: true })
  public fillColor!: string

  @Prop({ required: true })
  public path!: string

  public isDragging = false
  public beforeMouseX = 0
  public beforeMouseY = 0

  private mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  private beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  @Emit('mouseUp')
  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    event.preventDefault()
    return this.uuid
  }

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    event.preventDefault()
  }

  public mouseMove (event: MouseEvent) {
    if (!this.isDragging) return
    event.preventDefault()
    const blockElement = document.getElementById(this.uuid)
    svgZOrder.element(blockElement).toTop()
    const newPosition: Position = this.getNewPosition(event.offsetX, event.offsetY)
    const context = {
      position: newPosition,
      blockUniqueKey: this.uuid
    }
    this.emitUpdatePosition(context)
  }

  @Emit('mouseMove')
  public emitUpdatePosition (context: { position: Position; blockUniqueKey: string }) {
    return context
  }

  public getNewPosition (offsetX: number, offsetY: number) {
    const mouseX = offsetX
    const mouseY = offsetY
    let dx, dy
    [dx, dy] = [0, 0]
    if (this.beforeMouseX && this.beforeMouseY) {
      dx = mouseX - this.beforeMouseX
      dy = mouseY - this.beforeMouseY
    }
    this.beforeMouseX = mouseX
    this.beforeMouseY = mouseY
    const tempX = dx + Number(this.position.x)
    const tempY = dy + Number(this.position.y)
    const x = tempX > 0 ? tempX : this.position.x
    const y = tempY > 0 ? tempY : this.position.y
    return { x: x, y: y }
  }

  public popupContextMenu (event: Event) {
    const menu = this.buildContextMenu()
    const currentWindow = remote.getCurrentWindow()
    menu.popup({ window: currentWindow })
    event.preventDefault()
  }

  public buildContextMenu () {
    const menu = new Menu()
    menu.append(new MenuItem({ label: 'カット', accelerator: 'CmdOrCtrl+X' }))
    menu.append(new MenuItem({ label: 'コピー', accelerator: 'CmdOrCtrl+C' }))
    menu.append(new MenuItem({ label: 'ペースト', accelerator: 'CmdOrCtrl+V' }))
    menu.append(
      new MenuItem({
        label: '削除',
        accelerator: 'Backspace',
        click: this.calledByRemoveMenuItem
      })
    )
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '詳細メニューを開く', accelerator: 'CmdOrCtrl+M' }))
    menu.append(new MenuItem({ label: '非表示', accelerator: 'CmdOrCtrl+,' }))
    menu.append(new MenuItem({ label: '親ブロックとの接続を切る', enabled: false }))
    return menu
  }

  @Emit('remove')
  public calledByRemoveMenuItem () {
    return this.uuid
  }
}
</script>