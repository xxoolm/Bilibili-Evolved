import { ComponentEntry, componentsTags } from '@/components/types'
import { meta } from '@/core/meta'
import {
  getComponentSettings,
  getGeneralSettings,
  isUserComponent,
} from '@/core/settings'
import { Version } from '@/core/version'
import {
  defineComponentMetadata,
  defineOptionsMetadata,
  OptionsOfMetadata,
} from '@/components/define'
import { LaunchBarActionProvider } from '../launch-bar/launch-bar-action'
import { ComponentAction } from '../settings-panel/component-actions/component-actions'
import { isLocalItem, name, UpdateCheckItem } from './utils'
import * as checkerMethods from './checker'

const {
  checkComponentsUpdate,
  checkLastFeature,
  forceCheckUpdate,
  forceCheckUpdateAndReload,
  silentCheckUpdate,
} = checkerMethods

const optionsMetadata = defineOptionsMetadata({
  lastUpdateCheck: {
    displayName: '最后检查更新日期',
    defaultValue: 0,
    hidden: true,
  },
  lastInstalledVersion: {
    displayName: '最后安装版本',
    defaultValue: '2.0.0',
    hidden: true,
  },
  localPortOverride: {
    displayName: '本地组件链接端口',
    defaultValue: '',
    hidden: true,
  },
  minimumDuration: {
    displayName: '更新间隔 (ms)',
    defaultValue: 1000 * 3600 * 24,
  },
  urls: {
    displayName: '更新链接',
    defaultValue: {
      components: {} as Record<string, UpdateCheckItem>,
      plugins: {} as Record<string, UpdateCheckItem>,
      styles: {} as Record<string, UpdateCheckItem>,
    },
    hidden: true,
  },
  maxUpdateCount: {
    displayName: '单次最大更新量 (个)',
    defaultValue: 4,
    // hidden: true,
  },
})

const entry: ComponentEntry<typeof optionsMetadata> = async ({
  settings: { options: opt },
}) => {
  const now = Number(new Date())
  const duration = now - opt.lastUpdateCheck

  const isDurationExceeded = duration >= opt.minimumDuration
  const isVersionOutdated = new Version(meta.version).greaterThan(
    new Version(opt.lastInstalledVersion),
  )
  if (isDurationExceeded) {
    coreApis.lifeCycle.fullyLoaded(() => silentCheckUpdate())
  } else if (isVersionOutdated) {
    coreApis.lifeCycle.fullyLoaded(() => forceCheckUpdate())
  }

  return checkerMethods
}

type Options = OptionsOfMetadata<typeof optionsMetadata>

export const component = defineComponentMetadata({
  name,
  displayName: '自动更新器',
  description: {
    'zh-CN': '自动检查组件, 插件和样式的更新. (仅限从设置面板中安装的)',
  },
  tags: [componentsTags.utils],
  options: optionsMetadata,
  extraOptions: () => import('./ExtraOptions.vue').then(m => m.default),
  entry,
  plugin: {
    displayName: '自动更新器 - 功能扩展',
    description: {
      'zh-CN':
        '记录在设置面板中的功能安装/卸载数据供自动更新使用; 并在组件详情中支持手动检查该组件的更新.',
    },
    // 非设置面板的组件如果也对能功能进行修改, 建议调用此处的 Hooks 同步状态.
    setup: ({ addData, addHook }) => {
      const types = ['components', 'plugins', 'styles']
      types.forEach(type => {
        addHook(`user${lodash.startCase(type)}.add`, {
          after: (_, url: string, metadata: { name: string }) => {
            // console.log('hook', `user${lodash.startCase(type)}.add`, metadata.name, url)
            const { options } = getComponentSettings('autoUpdate')
            const existingItem = options.urls[type][
              metadata.name
            ] as UpdateCheckItem
            if (!existingItem) {
              options.urls[type][metadata.name] = {
                url,
                lastUpdateCheck: Number(new Date()),
                installTime: Number(new Date()),
                alwaysUpdate: isLocalItem(url),
              } as UpdateCheckItem
            } else {
              existingItem.url = url
              existingItem.lastUpdateCheck = Number(new Date())
              existingItem.alwaysUpdate = isLocalItem(url)
              // keep install time
            }
          },
        })
        addHook(`user${lodash.startCase(type)}.remove`, {
          after: (metadata: { name: string }) => {
            const { options } = getComponentSettings('autoUpdate')
            if (!options.urls[type][metadata.name]) {
              return
            }
            delete options.urls[type][metadata.name]
          },
        })
      })
      addData(
        'settingsPanel.componentActions',
        (actions: ComponentAction[]) => {
          const { options } = getComponentSettings<Options>('autoUpdate')
          actions.push(metadata => {
            const item = options.urls.components[metadata.name]
            if (!item) {
              return undefined
            }
            return {
              name: 'checkUpdate',
              displayName: '检查更新',
              icon: isLocalItem(item.url)
                ? 'mdi-file-download-outline'
                : 'mdi-cloud-download-outline',
              condition: () => isUserComponent(metadata),
              title: item.url,
              action: async () => {
                const { Toast } = await import('@/core/toast')
                const toast = Toast.info('检查更新中...', '检查更新')
                toast.message = await checkComponentsUpdate({
                  filterNames: [metadata.name],
                  force: true,
                })
                toast.duration = 3000
              },
            }
          })
        },
      )

      const icon = 'mdi-cloud-sync-outline'
      addData('launchBar.actions', (actions: LaunchBarActionProvider[]) => {
        actions.push({
          name: 'updateAllFeaturesActions',
          getActions: async () => [
            {
              name: '检查所有更新',
              description: 'Check Updates',
              action: async () => {
                const { Toast } = await import('@/core/toast')
                const toast = Toast.info('正在检查更新...', '检查所有更新')
                await forceCheckUpdateAndReload()
                toast.close()
              },
              icon,
            },
          ],
        })
      })
      if (getGeneralSettings().devMode) {
        addData('launchBar.actions', (actions: LaunchBarActionProvider[]) => {
          actions.push({
            name: 'updateLastFeatureActions',
            getActions: async () => [
              {
                name: '检查最近更新的功能',
                description: 'Check Last Update',
                action: async () => {
                  const { Toast } = await import('@/core/toast')
                  const toast = Toast.info(
                    '正在检查更新...',
                    '检查最近更新的功能',
                  )
                  await checkLastFeature()
                  toast.close()
                },
                icon,
              },
            ],
          })
        })
      }
    },
  },
})
