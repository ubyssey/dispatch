# Basic Git Usage

This is your basic git usage guide - by no means is this supposed to be a complete repository of git knowledge, but hopefully you should be able to use it as a good start! If you have questions, Google is your best friend. Past that, feel free to ask anyone!

Here are some great resources that are most definitely better than this one:
* [git - the simple guide](http://rogerdudler.github.io/git-guide/)
* [Interactive Guide to git](https://try.github.io/levels/1/challenges/1)
* [Another lightweight simple guide](http://guides.beanstalkapp.com/version-control/common-git-commands.html)
* [You can also use Github desktop - some like it, some don't](https://desktop.github.com)
---

### Quick Overview
The whole idea with git is __Version Control__. The Ubyssey has many different people working on different things, all from the same code base. Git allows us to work on our own tasks without interfering with anyone else. This is done by creating _branches_ off of the _Master Branch_ (in our case, it is called _develop_ - The master branch is where the 'good copy' of our code lives). We work on our branches, and once we are satisfied with our work, we _commit_ the changes. We then _push_ the changes back onto the Develop Branch. You then create a _pull request_, asking if you can make your changes to the master branch. If the changes are accepted, the pull request is _merged_, and your code is now a part of the master branch!
Github is just a super popular platform to view git repositories, and definitely something that is good to get acquainted with.

### Get yourself Git
First make sure you install git correctly! For that, go to these places:
* [Install git for OSX](https://git-scm.com/download/mac)
* [Install git for Windows](https://git-for-windows.github.io)
* [Install git for Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Also clone Dispatch
`git clone https://github.com/ubyssey/dispatch.git`

### Navigating Branches
You will most likely start out on the master branch _develop_. As well, lets say that you make a new hypothetical branch off of develop called _new_feature_branch_. To make _new_feature_branch_, type this into your terminal:

`git checkout -b new_feature_branch`

You should get a message like this:

`Switched to a new branch 'new_feature_branch'`

Let's say you want to switch back to the develop branch. Run this command:

`git checkout develop`

You should get

`Switched to branch 'develop'`

And to get back to _new_feature_branch_, it is just

`git checkout new_feature_branch`

which should return

`Switched to branch 'new_feature_branch'`

You have been navigating around you local repository!

### Making Changes
So far you have created a new branch _new_feature_branch_, and then switched back to develop, and then back to _new_feature_branch_.
Now lets say that you have created a new file `newfile.py` while you were in _new_feature_branch_, and modified another file `setup.py`. You are satisfied with your changes, and are ready to submit them to the master branch. Step one should be:

`git status`

This shows you the changed files, and what files are staged to be committed. It should return this:

```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   setup.py

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	newfile.py

no changes added to commit (use "git add" and/or "git commit -a")
```

What this is telling you is that you have one file that you have created (`Untracked files`), and one file that you have modified (`Changes not staged for commit`). There are a couple options from here.

Lets say that you decide that you don't actually like you changes with `newfile.py`. All you do is run the command

`git checkout -- newfile.py`

This command doesn't return a message. It just discards all of your changes that you have made for `newfile.py`. Be careful with this one, as it can be a pain to get them back.

Alright, now lets say that you didn't run `git checkout -- newfile.py`. You liked your changes and you want to 'stage' them to be committed. Staging is basically letting git know which of your changed files you want to be committed. There are two ways to stage files: if you want to add just one file (lets say `newfile.py`), you run this:

`git add newfile.py`

This line does not return anything. If you want to see your changes, use `git status`! This returns

```
On branch new_feature_branch
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   newfile.py

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   setup.py
```

Notice that now `newfile.py` is staged to be committed (as it is under `Changes to be committed`). If you wanted to commit `newfile.py` only, all you would have to do is commit. `setup.py` would remain as not staged for commit.

Lets say you are super happy with all of your changes, and want to commit them all at once. You could do `git add <filename>` for each file, or you could just do `git add .` which will add all of your unstaged files to staging. This will give a message like this:

```
On branch new_feature_branch
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   newfile.py
	modified:   setup.py
```

So now we have two files ready to be committed. Lets commit them!

`git commit -m "Added some functionality to setup.py and made newfile.py to make our lives easier"`

You should get something like this:

```
[new_feature_branch 552cdbe] Added some functionality to setup.py and made newfile.py to make our lives easier
 2 files changed, 3 insertions(+)
 create mode 100644 newfile.py
```

The `commit` command basically says 'All of these changes that I have made are good, and I want to save them in the git system.' The `commit` command always includes a message. If you don't include a message, it gets angry and can spit some weird error messages. Therefore, always include the `... -m "<YOUR MESSAGE>"`. Your message should be a sentence explaining the changes that you have made. As a general rule, you should include similar changes or similar files in each commit. This just makes each commit make more sense.

##### Notes:
- Most of the time, your files will be in folders. When you are doing `git add <file>`, <file> is really the full path from the base branch. E.g., maybe it would be `docs/basic_git.md`, or `dispatch/apps/events/facebook.py`. Just type out the entire path and filename (i.e. `git add dispatch/apps/events/facebook.py`)
- There is a difference between your files and the files that are actually used. You are on a __local__ repository of code, and the branches that run code is the __remote__ repository of code. To see the remote repositories that you have configured, run `git remote`. You should get `origin` as the only thing returned. When you commit changes like above, you are only committing them to your __local__ repository. What we will cover next is pushing your code to the remote branch, and then creating a pull request which is basically asking if your local changes can be made on the remote repository.
- Git as a whole is pretty friendly. If you make a mistake of some sort, it will usually tell you.

### Pushing code to the remote branch
Your next step will be to push the code. Practically, this allows you to create a Pull Request. The command is

`git push`

which, in our current case, returns

```
fatal: The current branch new_feature_branch has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin new_feature_branch
```

This error occurred because we haven't set an upstream branch for our brand new branch that we created (_new_feature_branch_). This just means you haven't told git where it should push new file changes. Running the command that they give you works pretty much all of the time.

`git push --set-upstream origin new_feature_branch`

Which returns

```
Counting objects: 4, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 450 bytes | 0 bytes/s, done.
Total 4 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/ubyssey/dispatch.git
 * [new branch]      new_feature_branch -> new_feature_branch
Branch new_feature_branch set up to track remote branch new_feature_branch from origin.
```

You can avoid this error when pushing a new branch by running this the first time you are pushing some commits:

`git push -u origin new_feature_branch`

This will do the same thing as above. After you have done this once, you can just run `git push` when you want to push something, and git will do the rest of the work.

### Pull requests
Once you have pushed the code, you should see something like this on the Github Dispatch Page:

  ![The picture failed to render; thats OK, the button is just `Compare and pull request` in a large yellow bar on the top of the page.](/docs/pull_req.png)

If you click `Compare and pull request`, it will bring you to a page where you can explain the changes you made and create the pull request. The code will then be reviewed and merged.

### Some other useful commands

##### git stash
  Lets say that you have made some changes to files in one branch, then decide they should be in another, or would just like to look around at other branches. You can use `git stash`. This temporarily saves your changes. Now you can look around other branches all you want. If you want the changes that you have stashed to be in a different branch, navigate to that branch with `git checkout <branch>`, and run `git stash apply`. All of your changes will now be in that new branch. If you want to commit your changes in the original branch, just navigate back and then run `git stash apply`.

##### git pull
  This command 'pulls' the changes from the remote branch onto your local branch. This is useful for when people have been merging a bunch of pull requests and your local master branch is out of date. Simply run `git pull`, and it will copy all of the files that you don't have into your local repository. Think of `git pull` as updating your master branch.

##### See the commits
  `git log --oneline --abbrev-commit --all --graph --decorate` - This shows you a tree view of the commits, merges, etc of the working branches. Not super useful, but its interesting. [This](http://think-like-a-git.net/sections/graph-theory.html) is an interesting read on the connection of git and graph theory, and where this command comes from.

##### Make them colorful
  `git config color.ui true` - Makes your output of some git commands colorful
