const core = require("@actions/core");
const github = require("@actions/github");

(async () => {
  if (!github.context.payload.pull_request) {
    core.setFailed(
      `A pull_request object could not be found.  You must use a workflow trigger that includes a pull_request context.`
    );
    process.exit(1);
  }

  let branchLabelMappings = {};
  try {
    branchLabelMappings = JSON.parse(core.getInput('branch_label_mappings'));
  } catch {
    core.setFailed(`The branch_label_mappings input is not formatted correctly.  It should be a JSON formatted object and able to be parsed when calling JSON.parse().`);
    process.exit(1);
  }

  const branchName = github.context.payload.pull_request.head.ref;

  console.log(`branch_label_mappings: ${JSON.stringify(branchLabelMappings)}`);
  const mappedLabel = branchLabelMappings[Object.keys(branchLabelMappings).find(k=> branchName.startsWith(k))];

  if (mappedLabel) {
    console.log(`Will add label "${mappedLabel}" for branch name "${branchName}".`);

    try {
      const octokit = github.getOctokit(core.getInput('token'));
      await octokit.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        labels: [mappedLabel],
      });
    } catch (error) {
      core.setFailed(`Failure occurred when adding label: ${error.message}`);
    }
  } else {
    console.log(`No label mapping found for branch name "${branchName}".`);
  }
})();
