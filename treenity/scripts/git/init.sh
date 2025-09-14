for D in *; do
  if [ -d "${D}" ]; then
    echo "${D}"
    cd ${D}
    git submodule update --init --recursive
    cd ..
  fi
done
