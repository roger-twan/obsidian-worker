import { Octokit } from 'octokit'

const triggerFolders = [
  'Technical',
  'General',
  'Reading',
  'Living',
  'Trail',
]

export default async (request, env) => {
  if (request.headers.get('Content-Type') === 'application/json') {
    const json = await request.json();
    const commit = json.head_commit;
    const addedFiles = commit.added;
    const removedFiles = commit.removed;
    const modifiedFiles = commit.modified;
    const websiteFiles = [...addedFiles, ...removedFiles, ...modifiedFiles];
    const wechatFiles = [...addedFiles, ...modifiedFiles];
    
    if (websiteFiles.some(file => triggerFolders.some(folder => file.includes(folder + '/')))) {
      await triggerGithubWorkflow(await env.KV.get('GITHUB_TOKEN'));
    }

    if (wechatFiles.some(file => triggerFolders.some(folder => file.includes(folder + '/')))) {
      // TODO: Trigger wechat build
    }
  }
  return new Response('Accepted', {status: 202});
}

const triggerGithubWorkflow = async (token) => {
  const octokit = new Octokit({
    auth: token,
  })

  await octokit.request(`POST /repos/roger-twan/website/actions/workflows/nextjs.yml/dispatches`, {
    ref: 'main',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}
