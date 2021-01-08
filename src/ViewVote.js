import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { groupBy } from 'lodash'
import './ViewVote.css'

/**
 *
 * @param {*} param0
 * 也可以从 cookie 里读出用户名或用户id
 */
export default function ViewVote({ userInfo }) {
  // 问题 id
  const { id } = useParams()
  // const history = useHistory()

  const [loading, setLoading] = useState(true)
  const [voteInfo, setVoteInfo] = useState(null)
  const [votings, setVotings] = useState(null)

  let groupedVotings
  let uniqueUsersCount

  if (!loading) {
    groupedVotings = groupBy(votings, 'optionId')
    uniqueUsersCount = new Set(votings.map(item => item.userId)).size
  }

  /**
   *
   */
  useEffect(() => {
    setVoteInfo(null)
    setLoading(true)

    axios.get(`/vote/${id}`).then(res => {
      setVoteInfo(res.data)
      setVotings(res.data.votings)
      setLoading(false)
    })
  }, [id])

  /**
   * 用于接收某个 vote 的新投票信息 (WebSocket)
   */
  useEffect(() => {
    if (!voteInfo) {
      return
    }

    if (Date.now() < new Date(voteInfo.deadline).getTime()) {
      // eslint-disable-next-line
      const ws = new WebSocket(`ws://${location.host}/vote/${id}`)

      ws.onmessage = e => {
        setVotings(JSON.parse(e.data))
      }

      return () => ws.close()
    }
  }, [id, voteInfo])

  async function voteUp(optionId, hasVoted) {
    // 已过 deadline
    if (Date.now() > new Date(voteInfo.deadline).getTime()) {
      console.log('该投票已过截止时间，谢谢参与')
      return
    }

    /**
     * 要区分单选和多选，还要区分是否已经选过当前选项
     */
    const thisVoting = {
      // id: -1,
      id: 0,
      optionId: optionId,
      voteId: id,
      userId: userInfo.id,
      avatar: userInfo.avatar,
      isMultiple: voteInfo.isMultiple,
    }

    if (!hasVoted && !thisVoting.isMultiple) {
      console.log('增加本次单选选投票')
      /**
       * 过滤出来非本用户单选项 的 voting 信息
       */
      const filterVotings = votings.filter(voting => {
        return voting.userId !== userInfo.id
      })

      setVotings([...filterVotings, thisVoting])
    } else if (!hasVoted && thisVoting.isMultiple) {
      console.log('增加本次多选投票')

      setVotings([...votings, thisVoting])
    } else {
      /**
       * 过滤掉 传入 voteUp 的 optionId 的投票, 保留取反后的那些投票
       */
      const filterVotings = votings.filter(voting => {
        return !(voting.userId === userInfo.id && optionId === voting.optionId)
      })

      setVotings(filterVotings)
    }

    // eslint-disable-next-line
    const res = await axios.post(`/voteup/${id}`, {
      optionId,
      isVoteDown: hasVoted,
    })
  }

  /**
   * 计算票数比率
   */
  function calcRatio(voteSum, userSet) {
    if (userSet === 0) {
      return 0
    }
    const ratio = ((voteSum / userSet) * 100).toFixed()
    return ratio
  }

  /**
   *
   */
  if (loading) {
    return <div>loading...</div>
  }

  /**
   * 时间格式转换
   */
  function timeFormat(timeStr) {
    const list = timeStr.split('/')
    const year = list.pop()
    list.unshift(year)

    return list.join('/')
  }

  return (
    <>
      {/* 单独引用的NavBar */}
      <div className='nav-scroller active bg-white shadow-sm fixed-top'>
        <nav className='nav'>
          <Link className='nav-link text-muted ml-3' to='/'>
            Nice Choice
            <img
              src='/avatar/goodJob.jpg'
              alt='logo'
              className='avatar rounded-circle ml-1'
            />
          </Link>
        </nav>
      </div>

      {/* 选项详情模块 */}
      {/* <div className='card-body mt-5'> */}
      <div className='card-body text-left mt-5'>
        <h3 className='card-title display-5'>{voteInfo.title}</h3>
        <div className='card-text text-muted my-4'>
          {voteInfo.desc} {voteInfo.isMultiple ? '[多选]' : '[单选]'}
        </div>

        {/* 计票选项显示模块 */}
        <ul className='list-group list-group-flush'>
          {voteInfo.options.map((option, index) => {
            /**
             * 当前选项的每一票都运行下面代码
             */
            const currVotings = groupedVotings[option.id] || []

            /**
             * 布尔化 currVotings 符合条件的选项
             * 并用变量 checkedState 进行判断
             */
            const booleangifyOfCurrVote = !!currVotings.find(
              item => item.userId === userInfo.id
            )
            const checkedState = !!booleangifyOfCurrVote

            return (
              <>
                <li
                  key={index + '-' + option.id}
                  className={
                    // (checkedState ? 'active ' : '') +
                    'list-group-item list-group-item-action d-flex justify-content-between'
                    // 'list-group-item list-group-item-action d-flex mx-auto'
                  }
                  onClick={() => {
                    voteUp(option.id, checkedState)
                  }}
                >
                  <span>
                    {/* 选项内显示文本 */}
                    <h5 className='option-text text-monospace'>
                      {option.content}
                    </h5>

                    {/* 勾选框 */}
                    <input
                      type='checkbox'
                      // className='mr-3'
                      checked={checkedState}
                      onChange={() => {}}
                    />
                  </span>

                  {/* 动态票数统计百分比模块 */}
                  {/* <span className='text-right'> */}
                  <span>
                    <strong className='dynmic-vote-count mr-2'>
                      {currVotings.length} 票
                    </strong>

                    <small>
                      {calcRatio(currVotings.length, uniqueUsersCount)} %
                    </small>
                  </span>
                </li>

                {/* 长度条模块 */}
                <div
                  className='option-ratio'
                  style={{
                    width:
                      calcRatio(currVotings.length, uniqueUsersCount) + '%',
                  }}
                ></div>

                {/* 头像模块 */}
                <ul className='avatars list-inline my-1'>
                  {currVotings.map((voting, idx) => {
                    return (
                      <li key={idx} className='list-inline-item'>
                        <img
                          alt='avatar'
                          className='avatar rounded-circle'
                          src={voting.avatar}
                        />
                      </li>
                    )
                  })}
                </ul>
              </>
            )
          })}
        </ul>
        <p className='text-muted text-sm-left mt-4'>
          投票截至：
          {timeFormat(new Date(voteInfo.deadline).toLocaleDateString())}
        </p>
      </div>
    </>
  )
}
