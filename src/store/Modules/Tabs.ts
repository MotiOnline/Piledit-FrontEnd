import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { PTab, PTabs } from '@/@types/piledit'
import store from '@/store/store'

export interface TabStateIF {
  tabs: PTabs;
  currentViewingTabUuid: string;
}

@Module({ store: store, name: 'TabsModule', namespaced: true })
export default class Tabs extends VuexModule implements TabStateIF {
  tabs: PTabs = {}
  currentViewingTabUuid = ''

  @Mutation
  public addTab (tab: PTab) {
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public removeTab (uuid: string) {
    Vue.delete(this.tabs, uuid)
  }

  @Action({ rawError: true })
  public addPage ({ title, url }: { title: string; url: string }) {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.addPage(title, url)
  }

  @Action({ rawError: true })
  public forward () {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.forward()
  }

  @Action({ rawError: true })
  public backward () {
    const tab = this.tabs[this.currentViewingTabUuid]
    console.log(tab)
    tab.history.backward()
  }

  @Mutation
  public setCurrentViewingTabUuid (uuid: string) {
    this.currentViewingTabUuid = uuid
  }

  @Action({ rawError: true })
  public init () {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab(uuid, '新しいタブ', '/')
    this.setCurrentViewingTabUuid(uuid)
    this.addTab(tab)
  }

  @Action({ rawError: true })
  public add ({ title, url }: { title: string; url: string }) {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab(uuid, title, url)
    this.addTab(tab)
  }

  @Action({ rawError: true })
  public remove (context: { uuid: string }) {
    this.removeTab(context.uuid)
  }

  @Action({ rawError: true })
  public updateCurrentViewingTabUuid (context: { uuid: string }) {
    this.setCurrentViewingTabUuid(context.uuid)
  }
}
