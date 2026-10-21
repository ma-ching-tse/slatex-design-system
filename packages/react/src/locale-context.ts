import { createContext, useContext } from 'react'

export type SlateXLocale = 'en' | 'zh'
const messages = {
  en: { clear:'Clear', hidePassword:'Hide password', showPassword:'Show password', select:'Select…', search:'Search', suggestions:'Search suggestions', suggestionsTitle:'Suggestions', loading:'Searching', empty:'No results', searchError:'Search failed', message:'Message', placeholder:'Type a message…', remove:'Remove', attach:'Add attachment', stop:'Stop generating', send:'Send message', close:'Close', more:'More options', cancel:'Cancel', confirm:'Confirm', closeAlert:'Dismiss alert', closeToast:'Dismiss notification' },
  zh: { clear:'清空', hidePassword:'隐藏密码', showPassword:'显示密码', select:'请选择', search:'搜索', suggestions:'搜索建议', suggestionsTitle:'搜索建议', loading:'搜索中', empty:'无匹配结果', searchError:'搜索失败', message:'消息', placeholder:'输入消息…', remove:'移除', attach:'添加附件', stop:'停止生成', send:'发送消息', close:'关闭', more:'更多选项', cancel:'取消', confirm:'确认', closeAlert:'关闭提示', closeToast:'关闭通知' },
}
export const SlateXLocaleContext = createContext<SlateXLocale>('en')
export function useSlateXMessages() { return messages[useContext(SlateXLocaleContext)] }
