import request from '@/utils/axios'
import type { R } from '@/utils/axios/types'
import type { TemplateEntry, TemplateEntryRemoveModeEnum } from '@/api/gen/template-entry/types'
import { TemplateEntryTypeEnum } from '@/api/gen/template-entry/types'
import type { UploadFile } from 'ant-design-vue/lib/upload/interface'

/**
 * 获取模板项列表
 * @param templateGroupKey
 */
export function listTemplateEntry(templateGroupKey: string) {
  return request.get<R<TemplateEntry[]>>(`/gen/template-entry/list/${templateGroupKey}`)
}

function getFormData(record: TemplateEntry, file?: UploadFile) {
  const formData = new FormData()
  const json = JSON.stringify(record)
  const blob = new Blob([json], {
    type: 'application/json'
  })
  formData.append('templateEntry', blob)
  if (record.type === TemplateEntryTypeEnum.BINARY_FILE) {
    formData.append('file', file as any)
  }
  return formData
}

/**
 * 添加模板目录项
 * @param record
 * @param file
 */
export function addTemplateEntry(record: TemplateEntry, file?: UploadFile) {
  const formData = getFormData(record, file)
  return request.post<R<void>>('/gen/template-entry', formData)
}

/**
 * 修改模板目录项
 * @param record
 * @param file
 */
export function updateTemplateEntry(record: TemplateEntry, file?: UploadFile) {
  const formData = getFormData(record, file)
  return request.put<R<void>>('/gen/template-entry', formData)
}

/**
 * 删除模板目录项
 * @param id 目录项id
 * @param mode 删除模式
 */
export function removeTemplateEntry(id?: string, mode?: TemplateEntryRemoveModeEnum) {
  return request.delete<R>(`/gen/template-entry/${id}`, {
    params: { mode: mode }
  })
}

/**
 * 移动模板项
 * @param entryId 被移动的目录项ID
 * @param targetEntryId 目标目录项ID
 * @param horizontalMove 是否移动到目标目录平级，否则移动到其内部
 */
export function moveEntry(entryId?: string, targetEntryId?: string, horizontalMove?: boolean) {
  return request.patch(`/gen/template-entry/${entryId}/position`, null, {
    params: { targetEntryId: targetEntryId, horizontalMove: horizontalMove }
  })
}

/**
 * 修改模板内容
 */
export function updateTemplateEntryContent(id: string, content: string) {
  const params = new URLSearchParams()
  params.append('id', String(id))
  params.append('content', content)
  return request.patch<R<void>>('/gen/template-entry/content', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 下载二进制文件
 * @param id
 */
export function binaryFileDownload(id: string) {
  return request.get('/gen/template-entry/download/' + id, {
    responseType: 'blob'
  })
}
