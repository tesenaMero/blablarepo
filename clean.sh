CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "Cleaning ${CYAN}.NET${NC} files\n"
rm -rf bin/
rm -rf obj/

#printf "Cleaning ${CYAN}npm modules${NC}\n"
#rm -rf node_modules/

printf "Cleaning ${CYAN}webpack${NC} dist\n"
rm -rf ClientApp/dist/
rm -rf wwwroot/dist/