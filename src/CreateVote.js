import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import axios from 'axios'

/**
 * 使用 useHooks 收集库的代码
 */
import { useInput, useBoolean, useArray } from 'react-hanger'

/**
 * ...
 */
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function CreateSingleVote() {
  const query = useQuery()
  const history = useHistory()
  const options = useArray(['', ''])
  const title = useInput()
  const desc = useInput()
  const deadline = useInput()
  const anonymous = useBoolean(false)
  const isMultiple = useBoolean(query.get('multiple') === '1' ? true : false)

  /**
   * 方便控制台直接查看调试
   */
  let watchObj = {
    query,
    history,
    options,
    title,
    anonymous,
    isMultiple,
  }

  console.log('watchObj: ', watchObj)

  function handleDeleteOption(idx) {
    if (options.length === 2) {
      return
    }

    options.removeIndex(idx)
  }

  /**
   * 创建投票交互逻辑部分
   */
  async function createVote() {
    try {
      // debugger
      const res = await axios.post('/vote', {
        title: title.value,
        desc: desc.value,
        options: options.value,
        deadline: new Date(deadline.value).toISOString(),
        anonymous: anonymous.value ? 1 : 0,
        isMultiple: isMultiple.value ? 1 : 0,
      })

      history.push('/vote/' + res.data.voteId)
      console.log('创建成功', res.data)
    } catch (e) {
      console.log('创建失败', e.toString())
    }
  }

  return (
    <>
      <h3>创建{isMultiple.value ? '多选' : '单选'}投票</h3>
      <div>
        <input
          type='text'
          value={title.value}
          onChange={title.onChange}
          placeholder='投票标题'
        />
      </div>
      <div>
        <input
          type='text'
          value={desc.value}
          onChange={desc.onChange}
          placeholder='补充描述 (可选) '
        />
      </div>
      <ul>
        {options.value.map((item, idx) => {
          return (
            <li key={idx}>
              <button onClick={() => handleDeleteOption(idx)}>&times;</button>
              <input
                type='text'
                value={item}
                onChange={e => {
                  options.setValue([
                    ...options.value.slice(0, idx),
                    e.target.value,
                    ...options.value.slice(idx + 1),
                  ])
                }}
              />
            </li>
          )
        })}
      </ul>

      <button onClick={() => options.push('')}>添加选项</button>

      <div>
        截止日期：
        <input
          type='datetime-local'
          value={deadline.value}
          onChange={deadline.onChange}
        ></input>
      </div>
      <div>
        匿名投票：
        <input
          type='checkbox'
          checked={anonymous.value}
          onChange={anonymous.toggle}
        />
      </div>
      <div>
        多选：
        <input
          type='checkbox'
          checked={isMultiple.value}
          onChange={isMultiple.toggle}
        />
      </div>
      <div>
        <button onClick={createVote}> 创建 </button>
      </div>
    </>
  )
}
