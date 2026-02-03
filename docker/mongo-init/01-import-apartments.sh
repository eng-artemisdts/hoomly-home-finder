#!/bin/bash
set -e
# Aguarda o MongoDB estar pronto para conexões
sleep 3
# Importa o JSON para a collection "apartments" no database "hoomly"
mongoimport \
  --host localhost \
  --port 27017 \
  --db hoomly \
  --collection apartments \
  --file /seed-data/apartments.json \
  --jsonArray
echo "Seed concluído: collection 'apartments' populada com sucesso."
