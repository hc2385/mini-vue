/*
    实现功能：
        1、解决组件中某个函数多次操作响应式数据导致，effect多次执行，影响效率
        2、增加nextTick函数，当数据任务执行完成后进行操作
 */

// 执行队列
let queue = []
// 是否要执行清除的任务
let isClear = true
// 用于nextTick的操作
let next = null

/**
 * 获取一个方法任务，即setup中返回的方法会被当成一个effect，放入到队列中执行
 * @param job 执行的方法，即传入的effectFn
 */
export function getAllJobs(job) {
    // 1、添加任务，对于一个effect只执行一次
    if (!queue.length || !queue.includes(job)) queue.push(job)

    // 2、执行并清除任务,并进行执行，而且不能在本次进行执行
    if (isClear) {
        isClear = false
        next = Promise.resolve().then(()=>{
            try {
                while (queue.length) {
                    let job = queue.shift()
                    job()
                }
            } finally {
                // 释放资源
                isClear = true
            }
        })
    }
}

/**
 * 这个方法中的任务执行结束之后要执行的操作
 * @param fn 传入的方法
 */
export function nextTick(fn) {
    // 保证它是下一次执行
    Promise.resolve().then(()=>{
        let res = null
        if (next instanceof Promise) res = next.then(fn())
        else res = fn()
        return res
    })
}
