import isCommentedQuerier from './isCommentedQuerier'

export default async ({ username, token, poolPromise }) => {
  let isCommented = isCommentedQuerier.querier

  let nonReviewedPrs = await poolPromise
  let commentedPrs = []

  let isCommentedPromises = nonReviewedPrs.map((pr)=> {
    return isCommented({ username, token, number: pr.number})
  })

  let results = await Promise.all(isCommentedPromises)

  results.forEach(({ owner, repo, number, commented }) => {
    if (commented) {
      commentedPrs.push(nonReviewedPrs.find(pr => {
        return pr.number === number &&
          pr.repo.owner.login === owner &&
          pr.repo.name === repo
      }))
    }
  })

  return commentedPrs
}
