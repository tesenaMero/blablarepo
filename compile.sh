CYAN='\033[0;36m'
NC='\033[0m' # No Color

if [ "$1" == "clean" ]; then
    printf "Cleaning ${CYAN}.NET${NC} files\n"
    rm -rf bin/
    rm -rf obj/

    printf "Cleaning ${CYAN}npm modules${NC}\n"
    rm -rf node_modules/

    printf "Cleaning ${CYAN}webpack${NC} dist\n"
    rm -rf ClientApp/dist/
    rm -rf wwwroot/dist/
fi

printf ".NET Environment: ${CYAN}Development${NC}\n"
export ASPNETCORE_ENVIRONMENT=Development

printf "Restoring .NET ${CYAN}project.json${NC} dependencies\n"
dotnet restore

printf "Restoring npm ${CYAN}package.json${NC} dependencies\n"
npm install

printf "Compiling with ${CYAN}webpack${NC}\n"
webpack --config webpack.config.vendor.js
webpack --config webpack.config.js

printf "Running .NET ${CYAN}server${NC}\n"
dotnet run