#!/usr/bin/env bash

BASH='/usr/bin/env bash'
NODE_VERSION=20

function brew_install() {
  if [ -z "`which brew`" ]; then
    echo "installing brew"
    $BASH -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  else
    echo "brew already installed"
  fi

  brew list $1 || brew install $1
}

# install python
if [ -z "`which python3`" ]; then
  echo "installing python"
  if [ `uname` = Darwin ]; then
    brew_install python
  else
    sudo apt install python3
  fi
else
  echo "python already installed"
fi

# install skaffold
if [ `uname` = Darwin ]; then
  brew_install skaffold
else
  # For Linux x86_64 (amd64)
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
  sudo install skaffold /usr/local/bin/
fi

# install nvm
if [ -z "$NVM_DIR" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | $BASH

else echo "nvm already installed"
fi
. ~/.bashrc

# install node 20
nvm use $NODE_VERSION
if [ "$?" != "0" ]; then
  echo "installing node $NODE_VERSION"
  nvm install $NODE_VERSION
  nvm use $NODE_VERSION

else echo "node $NODE_VERSION already installed"
fi

# install pnpm
echo "installing pnpm"
npm i -g pnpm
