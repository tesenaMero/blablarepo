Setup project
=================
1. Clone this repository (with submodules)
```sh
> git clone --recursive -b development https://danielcardeenas@bitbucket.org/cemex/rewebapporderproductcust2.git
```
2. Run the compilation script
```sh
> cd src/cemex
> bash compile.sh
```

Thats it you are ready to go

Project Workflow and Conventions
=================

## JIRA Project: 

- [CHANGE PROJECT HERE](https://cemexprojectonjira.com)

## Confluence Space: 

- [CHANGE CONFLUENCE SPACE HERE](https://cemexprojectonconfluence.com)

## Git Workflow and branching

![Git Workflow](/branchworkflow.png?raw=true "Git Branching Workflow")

This workflow uses two branches to record the history of the project. The master branch stores the official release history, and the development branch serves as an integration branch for features. It's also convenient to tag all commits in the master branch with a version number.

# Versioning

All release tags, and normal tags are made using [Semantic Versioning 2.0.0](http://semver.org) as the versioning base, including a last digit in case of production hot fixes. This will produce the following example:

2.0.0.1

- **MAJOR** version when you make backwards incompatible changes,
- **MINOR** version when you add functionality in a backwards-compatible manner,
- **PATCH (ITERATION)** version when you make backwards-compatible bug fixes or improvements. and
- **HOTFIX** version when a critical bug in production needs to be addressed quickly



# Branching promotion
The code operates on two main branches, `master` and `development`. The project branch retrieves the code from the `master` branch. The `master` operates according to the same rules as the `master` branch with the only exception that it only handles code.

### master
This is the main repository used for deploying releases. No development is done here but rather branched to **development** or **hotfix** to later be merged back into the master branch when ready for a release. The master holds all release tags, and tags are made using [Semantic Versioning 2.0.0](http://semver.org) and the hotfix digit.

#### Common conventions:
- **Naming convention:** Refer to [Semantic Versioning 2.0.0](http://semver.org) including a hotfix digit

### hotfix
Hotfix branches are used to quickly patch production releases. This is the only branch that should fork directly off of master. As soon as the fix is complete, it should be merged into both master and development (or the current release branch), and master should be tagged with an updated version number.

#### Common conventions:
- **Naming convention:** hotfix-* or hotfix/*
- **branch off:** master
- **merge into:** master/development/release

### release
Once development has acquired enough features for a release (or a predetermined release date is approaching), you fork a release branch off of development. Creating this branch starts the next release cycle, so no new features can be added after this point only bug fixes, documentation generation, and other release-oriented tasks should go in this branch. Once it's ready to ship, the release gets merged into master and tagged with a version number. In addition, it should be merged back into development, which may have progressed since the release was initiated.

Using a dedicated branch to prepare releases makes it possible for one team to polish the current release while another team continues working on features for the next release. It also creates well-defined phases of development (e.g., it's easy to say, this week we're preparing for version 2.0.3.0 and to actually see it in the structure of the repository).

#### Common conventions:
- **branch off:** development
- **merge into:** master
- **naming convention:** release-*

### development
This is the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release. This is where any automatic nightly builds are built from. Larger tasks, issues and/or fatures are branched into a feature branch only to be marged back into the development branch in the future.

### feature
Feature branches (or sometimes called topic branches) are used to development new features for the upcoming or a distant future release. When starting development of a feature, the target release in which this feature will be incorporated may well be unknown at that point. The essence of a feature branch is that it exists as long as the feature is in development, but will eventually be merged back into develop (to definitely add the new feature to the upcoming release) or discarded (in case of a disappointing experiment).

#### Common conventions:
- **branch off:** development
- **merge into:** development
- **naming convention:** anything except master, development, release-, or hotfix-*

# JIRA Integration
All Git repositories are connected to a project in JIRA and you can add comments and log time from the commit message in git to a project issue.

##### Comment Directive
ISSUE_KEY #comment <comment_string>

Records a comment against an issue.  For example:
```
DCM000CXSRMA-34 #comment corrected indent issue
```
Adds the comment "corrected indent issue" to the issue.

##### Time Command
ISSUE_KEY #time <value>w <value>d <value>h <value>m  <comment_string> 
```
DCM000CXSRMA-34 #time 1w 2d 4h 30m Total work logged
```
This example records 1 week, 2 days, 4hours and 30 minutes against an issue, and adds the comment 'Total work logged' in the Work 

All commits must be associated with an Issue in JIRA. **If no issue exists you should create one**. For example, you might need to refactor some code. Instead of logging your time to the last issue you were working on, create a new issue called "refactoring code" and commit that code with a comment to that very issue. That will keep ourselves informed on what's happening and why someone just "wasted" 8 hours work on some seamingly meaningless task that didn't produce any neat features.


### Further details and complete guide
- [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)
- [Semantic Versioning 2.0.0](http://semver.org)

### Valuable Tools

- [Gitflow](https://github.com/nvie/gitflow)
- [SourceTree](https://www.sourcetreeapp.com/)
- [StackEdit](https://stackedit.io/)

# The laws of code
1. A developer must not commit faulty code to any other branch than his/her own feature branch. 
2. A developer must at all times commit to follow the naming and code conventions.
3. A developer must not go on vacation to far away countries without first doing a commit and push.
4. A developer must associate all commits with an Issue in JIRA.

Any failure to comply to the laws of code is forced to buy donuts for the entire team. These laws are editable per team.

# The Repository Team

### Permissions Chart

Permission level is defined as following:

- **W**: A developer can write in branch
- **M**: A developer can merge pull requests to branch (includes **P**)
- **R**: A developer is the defined reviewal authority (includes **P**)
- **P**: A developer can create pull to request petitions and can create branches.

Branch Name | Senior | Member | Reviewal Authority
--- | --- | --- |--- | --- | ---
master | P | P |  P
hotfix | W | W |  R
release-pre | M | P |  R
release-qa | M | P |  R
development | M | P |  R
features (any name) | W | P | P 
personal (any name) | W | W | W 

### Senior Developer

- [Change This](mailto:)

### Development Team

- [Change This](mailto:)

### Reviewal Authority

- [Change This](mailto:)
