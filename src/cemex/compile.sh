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

# Default dev
export API_ENV=dev/
export API_HOST=https://api.us2.apiconnect.ibmcloud.com/
export API_HOST_FULL=https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/
export API_ORG=cnx-gbl-org-development/
export APP_CODE=OrderProductCat_App
export CLIENT_ID=dd2ee55f-c93c-4c1b-b852-58c18cc7c277

if [ "$1" == "quality" ]; then
    export API_HOST=https://api.us2.apiconnect.ibmcloud.com/
    export API_HOST_FULL=https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-quality/quality/
    export API_ORG=cnx-gbl-org-quality/
    export API_ENV=quality/
    export APP_CODE=OrderProductCat_App
    export CLIENT_ID=721e5c7b-73b8-40e1-8cb2-31c7dbdbd1be
fi

printf "Cleaning ${CYAN}dls submodule${NC} dist\n"
rm -rf submodules/dls/node_modules

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