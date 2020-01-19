#!/usr/bin/env bash
set -e

K_BUILD_FILENAME="ministun.min.js"
K_BUILD_PATH="dist"
K_SRC_FILES="src/*.js"
K_CLOSURE_PATH="/mnt/c/users/noah/desktop/repos/closure/closure-compiler-v20200112.jar"

echo -e "\nOK, building to ${K_BUILD_DIR}/${K_BUILD_FILENAME}\n"
java -jar ${K_CLOSURE_PATH} --js=${K_SRC_FILES} --js_output_file=${K_BUILD_PATH}/${K_BUILD_FILENAME} --compilation_level WHITESPACE_ONLY
echo -e "\nDone!\n"