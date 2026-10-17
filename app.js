// ---- Lieux vérifiés (confirmés par Emmanuel le 2026-10-08) ----
// Photos : ajouter  photos: ["photos/chez-gaby-1.jpg"]  (photos prises par Emmanuel, dossier photos/ du dépôt).
// WhatsApp : ajouter  whatsapp: true  seulement quand le numéro est confirmé sur WhatsApp.
const VERIFIES = [
  { nom: "Chez Gaby", cat: "restaurant", type: "Restaurant portugais", adresse: "26, avenue Roi Beaudouin, Gombe", tel: "+243 819 904 213", horaires: "Lun–Sam : 12h–22h", lat: -4.304919, lng: 15.290544 },
  { nom: "Wabi Sabi", cat: "restaurant", type: "Restaurant asiatique", adresse: "10, avenue de l'Équateur, Gombe", tel: "+243 900 000 702", horaires: "Tous les jours : 12h–01h", lat: -4.302184, lng: 15.310935 },
  { nom: "Le Z Restaurant et Lounge", cat: "restaurant", type: "Restaurant et lounge", adresse: "Immeuble Matrix, 119 Boulevard du 30 Juin, 8e étage, Gombe", tel: "+243 828 664 628", horaires: "Lun : fermé ; Mar–Jeu : 12h–01h ; Ven : 12h–01h ; Sam : 15h–01h ; Dim : 12h–01h", lat: -4.309240, lng: 15.292253 },
  { nom: "Pharmacie Santemetre", cat: "pharmacie", type: "Pharmacie", adresse: "44, avenue Tombalbaye, Gombe", tel: "+243 999 935 970", horaires: "24h/24 – 7j/7", lat: -4.306177, lng: 15.310710 },
  { nom: "Pharmacie du 30 Juin", cat: "pharmacie", type: "Pharmacie", adresse: "Avenue des Batetela, Gombe", tel: "+243 999 933 690", horaires: "24h/24 – 7j/7", lat: -4.316805, lng: 15.279037 },
  // ---- Établissements (écoles, universités, hôpitaux) ajoutés le 2026-10-09 ----
  {"nom": "ISP-Gombe (Institut Supérieur Pédagogique)", "cat": "ecole", "type": "Université / Institut supérieur", "adresse": "Av. Père Boka", "tel": "+243 822 358 732", "horaires": "", "lat": -4.304903, "lng": 15.311261},
  {"nom": "Université William Booth", "cat": "ecole", "type": "Université / Institut supérieur", "adresse": "Gombe (Plus Code M8R8+WQF)", "tel": "+243 816 902 442", "horaires": "Lun–Sam 8h00–17h30, Dim fermé", "lat": -4.307695, "lng": 15.316928},
  {"nom": "ISPT-Kin (Institut Supérieur Pédagogique et Technique)", "cat": "ecole", "type": "Université / Institut supérieur", "adresse": "05, Av. de la Science", "tel": "+243 991 221 378", "horaires": "Lun–Sam (24h), Dim fermé", "lat": -4.32417, "lng": 15.290008, "remarque": "Limite sud de la Gombe, près de Lingwala"},
  {"nom": "ISAM (Institut Supérieur des Arts et Métiers)", "cat": "ecole", "type": "Université / Institut supérieur", "adresse": "Av. Pierre Mulele, à côté de la Cathédrale Notre-Dame", "tel": "+243 816 882 526", "horaires": "", "lat": -4.324673, "lng": 15.294355, "remarque": "Limite sud de la Gombe, près de Lingwala"},
  {"nom": "Collège Boboto (jésuite)", "cat": "ecole", "type": "École", "adresse": "Gombe (Plus Code M7RP+77H)", "tel": "+243 899 377 925", "horaires": "", "lat": -4.309307, "lng": 15.285749, "remarque": "La fiche indique 24h : à vérifier"},
  {"nom": "Lycée Français René Descartes", "cat": "ecole", "type": "École", "adresse": "33, Av. de la Gombe", "tel": "+243 851 105 567", "horaires": "Lun–Ven 7h30–18h00", "lat": -4.31885, "lng": 15.287696},
  {"nom": "Lycée Sacré-Cœur", "cat": "ecole", "type": "École", "adresse": "Gombe (Plus Code M7RM+R82)", "tel": "+243 824 232 684", "horaires": "", "lat": -4.307988, "lng": 15.283263},
  {"nom": "École Belge de Kinshasa", "cat": "ecole", "type": "École", "adresse": "près de l'Av. de la Gombe (Plus Code M7JQ+QVW)", "tel": "", "horaires": "Lun–Ven 7h00–13h00", "lat": -4.318005, "lng": 15.28971},
  {"nom": "School Eureka de Kinshasa", "cat": "ecole", "type": "École", "adresse": "Av. de la Gombe (Plus Code M7JQ+WRX)", "tel": "+243 818 102 749", "horaires": "Lun–Ven 7h30–15h30, Sam 10h30–15h00", "lat": -4.317638, "lng": 15.289594},
  {"nom": "École Les Oisillons (primaire)", "cat": "ecole", "type": "École", "adresse": "Av. Katanga", "tel": "+243 998 761 212", "horaires": "", "lat": -4.304302, "lng": 15.294485},
  {"nom": "David's Academy International School", "cat": "ecole", "type": "École", "adresse": "Gombe (Plus Code M8W2+848)", "tel": "+243 897 111 327", "horaires": "", "lat": -4.304219, "lng": 15.300334},
  {"nom": "École Chrétienne Emmanuel", "cat": "ecole", "type": "École", "adresse": "4, Av. Cadeco", "tel": "+243 898 932 322", "horaires": "Lun–Ven 7h30–17h30, Sam 7h30–12h30", "lat": -4.30623, "lng": 15.289904},
  {"nom": "École Chrétienne La Source de Vie", "cat": "ecole", "type": "École", "adresse": "Gombe (sans rue précise)", "tel": "+243 829 800 813", "horaires": "Lun–Ven 7h30–14h00", "lat": -4.305669, "lng": 15.288264},
  {"nom": "Collège Technique de la Gombe", "cat": "ecole", "type": "École", "adresse": "près de l'Av. de la Science (Plus Code M7GV+2G2)", "tel": "", "horaires": "Lun–Sam 7h00–13h30", "lat": -4.324989, "lng": 15.293781, "remarque": "Limite sud de la Gombe"},
  {"nom": "CHU Renaissance", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "Av. de l'Hôpital", "tel": "+243 823 419 373", "horaires": "24h/24, 7j/7", "lat": -4.308983, "lng": 15.306177},
  {"nom": "Centre Médical Diamant", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "3642, Bd du 30 Juin (1er et 2e étages)", "tel": "+243 907 777 780", "horaires": "24h/24, 7j/7", "lat": -4.304227, "lng": 15.306174},
  {"nom": "Centre Médical de la Mongala", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "48, Av. de la Mongala, Q/ Révolution", "tel": "+243 854 863 549", "horaires": "24h/24, 7j/7", "lat": -4.302496, "lng": 15.307944},
  {"nom": "Centre Médical Botour (CMB)", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "Locaux 40-41, Immeuble Botour", "tel": "+243 997 421 417", "horaires": "24h/24, 7j/7", "lat": -4.303728, "lng": 15.313101},
  {"nom": "CHIK Hospital", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "11, Av. Basoko", "tel": "+243 828 086 911", "horaires": "24h/24, 7j/7", "lat": -4.306749, "lng": 15.319458},
  {"nom": "HJ Hospitals – Clinique Gombe", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "8225, Imm. Modern Paradise, Av. Kabasele Tshiamala (ex-Flambeau)", "tel": "+243 815 586 555", "horaires": "Lun–Ven 8h–20h, Sam 8h–19h, Dim 9h–14h", "lat": -4.305768, "lng": 15.322705},
  {"nom": "New Medicis Clinic", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "1356, Av. Tombalbaye", "tel": "+243 818 120 634", "horaires": "24h/24, 7j/7", "lat": -4.310028, "lng": 15.29962},
  {"nom": "Clinique & Laboratoire Le Magnolia", "cat": "sante", "type": "Hôpital / Centre médical", "adresse": "1525, Bd du 30 Juin", "tel": "+243 977 775 757", "horaires": "24h/24, 7j/7", "lat": -4.305722, "lng": 15.303187},
  // ---- Commerces, loisirs, pharmacies, hôtels… ajoutés le 2026-10-09 ----
  {"nom": "Cedars Boulangerie, Authentic Lebanese food", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Av. Du Marais (Plus Code M8R6+W5F)", "tel": "+243 850 555 555", "horaires": "7j/7 8h00–22h30", "lat": -4.3076962, "lng": 15.3104314},
  {"nom": "City Market", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "713 Avenue des Aviateurs", "tel": "+243 817 270 707", "horaires": "Lun–Sam 8h00–22h00 ; Dim 9h00–22h00", "lat": -4.3006175, "lng": 15.3106572},
  {"nom": "Eric Kayser", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "18 Av. de la Justice", "tel": "+243 970 021 125", "horaires": "Lun–Sam 7h00–20h00 ; Dim 8h00–20h00", "lat": -4.318814, "lng": 15.2745119, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Food Town Supermarket", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "44 Avenue du Commerce", "tel": "+243 840 222 211", "horaires": "Lun–Sam 8h00–22h00 ; Dim 9h00–22h00", "lat": -4.306849, "lng": 15.314295},
  {"nom": "GG Mart", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Av. Tombalbaye", "tel": "+243 971 060 620", "horaires": "Lun–Sam 7h00–23h00 ; Dim 8h00–21h30", "lat": -4.3060579, "lng": 15.3128466},
  {"nom": "GG Mart Select", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Croisement Avenue des Aviateurs, Select Shopping Mall, Derrière CENI et Sozacom, Av. Isiro", "tel": "+243 976 036 745", "horaires": "Lun–Sam 7h00–23h00 ; Dim 8h00–23h00", "lat": -4.3014462, "lng": 15.3141712},
  {"nom": "Grand Marché de Kinshasa ( Zando )", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Av. Du Marché (Plus Code M8Q6+VXG)", "tel": "", "horaires": "Lun–Sam 24h ; Dim fermé", "lat": -4.3103198, "lng": 15.3124651},
  {"nom": "Kin Marché", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "11 Av. De La Presse", "tel": "+243 891 441 111", "horaires": "7j/7 7h00–23h00", "lat": -4.3034266, "lng": 15.3129441},
  {"nom": "Kin Marché Boulevard (Ex Peloustore)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "34 Bd du 30 Juin", "tel": "+243 891 441 111", "horaires": "7j/7 24h", "lat": -4.3052193, "lng": 15.3045955},
  {"nom": "Kinmart Super Marché", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Nyamuragira", "tel": "+243 812 525 000", "horaires": "Lun–Sam 7h00–23h00 ; Dim 8h00–23h00", "lat": -4.3029785, "lng": 15.3126096},
  {"nom": "La Cave De Bacchus (24 Novembre)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Mag No.4, Complex Commercial No. 3759, 24 Novembre", "tel": "+243 971 060 222", "horaires": "Lun–Sam 9h00–21h00 ; Dim 10h00–18h30", "lat": -4.3179498, "lng": 15.2926757},
  {"nom": "La Cave De Bacchus (Boulevard 30 Juin)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "AVENUE NGONGO LUTETE NO. 6147, BOULEVARD DU 30 JUIN C/GOMBE NIF : A0700218W", "tel": "+243 903 007 150", "horaires": "Lun–Sam 10h00–21h00 ; Dim 10h00–18h30", "lat": -4.3049815, "lng": 15.3032269},
  {"nom": "La cave des saveurs", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Sergent Moke", "tel": "+243 839 336 325", "horaires": "", "lat": -4.3273499, "lng": 15.2914387, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Maison Galaxy Boulevard", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "1030 Av. de l'Equateur", "tel": "+243 829 502 062", "horaires": "Lun–Sam 7h00–23h00 ; Dim 8h00–22h00", "lat": -4.3025057, "lng": 15.3102475},
  {"nom": "Marché Nouveau DAIPN", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Place des Évolués (Plus Code M7VP+J6M)", "tel": "+243 979 887 811", "horaires": "", "lat": -4.305912, "lng": 15.2855504},
  {"nom": "Newlys Super Marche (Gombe)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Av. Tombalbaye", "tel": "+243 862 202 280", "horaires": "7j/7 6h30–23h00", "lat": -4.3062864, "lng": 15.3113127},
  {"nom": "S&K Supermarché INSS (C/GOMBE)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "No 1/A C, Av. Mbuji-Mayi", "tel": "+243 890 011 051", "horaires": "7j/7 6h00–0h00", "lat": -4.3059598, "lng": 15.2963725},
  {"nom": "S&K Supermarché JUSTICE (C/GOMBE)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "AVENUE JUSTICE, 60 C GOMBE", "tel": "+243 828 318 647", "horaires": "7j/7 6h00–0h00", "lat": -4.311689, "lng": 15.2852417},
  {"nom": "S&K Supermarché Royal (C/Gombe)", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Immeuble Royal, Av. de la Justice", "tel": "+243 991 111 111", "horaires": "7j/7 24h", "lat": -4.3144799, "lng": 15.2823394},
  {"nom": "Supermarche Regal", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Gombe (Plus Code M8V3+W5X)", "tel": "", "horaires": "7j/7 9h00–21h00", "lat": -4.3051486, "lng": 15.3029768},
  {"nom": "Supermarché Extra plus", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "012, Av. de l'Equateur (Plus Code M8V5+XQ2)", "tel": "+243 999 159 710", "horaires": "Lun–Sam 6h30–18h00 ; Dim 8h00–13h00", "lat": -4.3048672, "lng": 15.3095152},
  {"nom": "Supermarché Setalus", "cat": "commerce", "type": "Supermarché / alimentation", "adresse": "Av. de la Justice (Plus Code M7QP+83Q)", "tel": "", "horaires": "7j/7 8h00–21h30", "lat": -4.3116674, "lng": 15.2852393},
  {"nom": "110 Street - International Diner", "cat": "restaurant", "type": "Restaurant / café", "adresse": "110, 1113 Bd du 30 Juin", "tel": "+243 895 885 370", "horaires": "7j/7 24h", "lat": -4.3113048, "lng": 15.2872407},
  {"nom": "A Casa Mia Kinshasa", "cat": "restaurant", "type": "Restaurant / café", "adresse": "70b Av. Uvira", "tel": "+243 812 331 938", "horaires": "Lun fermé ; Mar–Dim 12h00–22h30", "lat": -4.310348, "lng": 15.2753641},
  {"nom": "Al Dar", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin (Plus Code M8W6+WG4)", "tel": "+243 999 957 888", "horaires": "Lun–Ven 7h00–22h30 ; Sam 7h00–23h30 ; Dim 7h00–22h30", "lat": -4.3027335, "lng": 15.3113422},
  {"nom": "Ali Baba Restaurant & Coffee", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Alibaba restaurant 24halal", "tel": "+243 980 000 700", "horaires": "7j/7 24h", "lat": -4.3038125, "lng": 15.3118125},
  {"nom": "Aria Italian Restaurant", "cat": "restaurant", "type": "Restaurant / café", "adresse": "09 Av. De La Mongala", "tel": "+243 998 386 718", "horaires": "7j/7 12h00–23h00", "lat": -4.303245, "lng": 15.3068482},
  {"nom": "Art du Burger By d'Vins", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Galerie La Fontaine DRC, Av. des Batetela", "tel": "+243 818 746 767", "horaires": "Lun fermé ; Mar–Dim 11h00–22h30", "lat": -4.3135813, "lng": 15.2755592},
  {"nom": "Beirut deli", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Rond-Point Forescom, 15 Av. de la Paix", "tel": "+243 900 724 724", "horaires": "Lun–Jeu 11h30–23h00 ; Ven–Dim 11h30–0h00", "lat": -4.3016721, "lng": 15.3089213},
  {"nom": "Buk's Resto-Bar", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin", "tel": "", "horaires": "", "lat": -4.3067533, "lng": 15.3026286},
  {"nom": "Burger Guys DRC", "cat": "restaurant", "type": "Restaurant / café", "adresse": "3ème étage, Matrix Mall (LC Waikiki, Bd du 30 Juin", "tel": "+243 900 005 444", "horaires": "7j/7 11h00–23h00", "lat": -4.3095645, "lng": 15.2915127},
  {"nom": "Celia Restaurant-café", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7WX+5VM)", "tel": "+243 904 333 338", "horaires": "Lun 8h00–23h00 ; Mar 10h00–23h00 ; Mer–Sam 8h00–23h00 ; Dim 8h42–23h00", "lat": -4.3045258, "lng": 15.299678},
  {"nom": "Chiken In Galitos", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. de la Gombe (Plus Code M7JR+X2P)", "tel": "+243 897 786 569", "horaires": "", "lat": -4.3175388, "lng": 15.2900831},
  {"nom": "Coffee Shops Congolais CAFÉ SAFI PETIT KWILU", "cat": "restaurant", "type": "Restaurant / café", "adresse": "115 Av. Col. Ebeya", "tel": "", "horaires": "", "lat": -4.3067796, "lng": 15.3051942},
  {"nom": "Cook's Bistro", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7MR+RQ5)", "tel": "+243 858 566 034", "horaires": "", "lat": -4.3154824, "lng": 15.291989},
  {"nom": "Don pablo pizza", "cat": "restaurant", "type": "Restaurant / café", "adresse": "1234", "tel": "+243 810 348 896", "horaires": "7j/7 24h", "lat": -4.302023, "lng": 15.3073919},
  {"nom": "Donishka officiel", "cat": "restaurant", "type": "Restaurant / café", "adresse": "74 Av. Col. Ebeya", "tel": "+243 901 791 643", "horaires": "7j/7 24h", "lat": -4.305926, "lng": 15.3057223},
  {"nom": "Eric Kayser Ville", "cat": "restaurant", "type": "Restaurant / café", "adresse": "278 Av. de l'Equateur", "tel": "+243 819 839 000", "horaires": "Lun–Sam 7h00–20h00 ; Dim 8h00–20h00", "lat": -4.3015008, "lng": 15.3105545},
  {"nom": "FIRENZE PÂTISSERIE", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. TomBalbaye (Plus Code M8R3+H4M)", "tel": "+243 993 993 993", "horaires": "Lun–Sam 7h00–20h30 ; Dim 10h00–20h30", "lat": -4.3085349, "lng": 15.3027861},
  {"nom": "Glacier de kin", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. Mutombo Katshi", "tel": "+243 817 111 121", "horaires": "7j/7 9h00–22h00", "lat": -4.3027729, "lng": 15.3101764},
  {"nom": "Green Olive", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin", "tel": "+243 895 222 777", "horaires": "7j/7 11h00–0h00", "lat": -4.3051923, "lng": 15.3020148},
  {"nom": "Istanbul - Pide & Kebap", "cat": "restaurant", "type": "Restaurant / café", "adresse": "3rd Floor, Galleria mall Kinshasa", "tel": "", "horaires": "", "lat": -4.3041086, "lng": 15.2999341},
  {"nom": "Jemi's cuisine", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Galerie La fontaine, premier niveau, Av. des Batetela", "tel": "+243 999 909 365", "horaires": "Lun–Jeu 13h00–23h55 ; Ven 13h00–0h30 ; Sam 13h00–0h55 ; Dim 13h00–0h30", "lat": -4.3139506, "lng": 15.2760979},
  {"nom": "Kiros", "cat": "restaurant", "type": "Restaurant / café", "adresse": "22 Av. Rep Du Tchad (Plus Code M8W6+5R8)", "tel": "+243 856 123 456", "horaires": "7j/7 7h00–22h00", "lat": -4.3049351, "lng": 15.3125335},
  {"nom": "Kiwondo's", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. Du 24 Novembre", "tel": "+243 833 431 921", "horaires": "Lun–Jeu 12h30–20h30 ; Ven 12h30–21h00 ; Sam 12h00–21h00 ; Dim 12h30–21h00", "lat": -4.3150528, "lng": 15.2917862},
  {"nom": "KONGO_AFRICAN_FOOD", "cat": "restaurant", "type": "Restaurant / café", "adresse": "10100", "tel": "+243 823 588 789", "horaires": "Lun–Sam 12h00–0h00 ; Dim 13h00–0h00", "lat": -4.3085529, "lng": 15.3027301},
  {"nom": "Kora Restaurant Terrace", "cat": "restaurant", "type": "Restaurant / café", "adresse": "ref immeuble Empire, 1 Av. Du Mont Des Arts", "tel": "+243 808 883 048", "horaires": "Lun–Jeu 10h00–21h00 ; Ven 10h00–22h00 ; Sam 10h00–23h00 ; Dim 12h00–22h00", "lat": -4.3146035, "lng": 15.2974065},
  {"nom": "kos restaurant", "cat": "restaurant", "type": "Restaurant / café", "adresse": "115 Av. Col. Ebeya", "tel": "+243 850 076 960", "horaires": "Lun–Ven 9h00–22h00 ; Sam–Dim 9h00–23h30", "lat": -4.3059064, "lng": 15.3089122},
  {"nom": "L`etoile", "cat": "restaurant", "type": "Restaurant / café", "adresse": "4 Av. des Batetela", "tel": "+243 817 602 658", "horaires": "", "lat": -4.3128808, "lng": 15.2732982},
  {"nom": "La Case Resto-Grill Kinshasa Gombe", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe Réf: En face du saut de mouton Assanef, 243 Av. De la libération", "tel": "+243 812 420 260", "horaires": "7j/7 24h", "lat": -4.3268295, "lng": 15.2959604, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "La Pâtisserie Nouvelle", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. Colonel Mondjiba (Plus Code M7GC+F3X)", "tel": "+243 814 226 640", "horaires": "Lun–Ven 6h00–19h00 ; Sam–Dim 6h00–18h00", "lat": -4.323767, "lng": 15.2702207, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "La Villa Hesbay Gombe", "cat": "restaurant", "type": "Restaurant / café", "adresse": "12 Av. des Cocotiers", "tel": "+243 895 390 229", "horaires": "7j/7 24h", "lat": -4.3173385, "lng": 15.287746},
  {"nom": "LA VILLA RIVIERA RDC", "cat": "restaurant", "type": "Restaurant / café", "adresse": "87, Boulevard du 30 juin, Reference:, CNSS", "tel": "+243 900 222 999", "horaires": "7j/7 7h00–23h00", "lat": -4.3072209, "lng": 15.2975046},
  {"nom": "Le Mandarin Restaurant Kinshasa", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin (Plus Code M7VW+3GH)", "tel": "+243 999 931 358", "horaires": "Lun fermé ; Mar–Dim 12h00–15h00, 19h00–22h30", "lat": -4.3073081, "lng": 15.2963718},
  {"nom": "Le Pain Quotidien", "cat": "restaurant", "type": "Restaurant / café", "adresse": "02 Av. de la Justice", "tel": "+243 846 924 444", "horaires": "7j/7 8h00–22h00", "lat": -4.3058967, "lng": 15.2940739},
  {"nom": "Le passage gourmand", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Sozacom, Bd du 30 Juin", "tel": "", "horaires": "", "lat": -4.3020585, "lng": 15.3139403},
  {"nom": "Le Siege Restaurant", "cat": "restaurant", "type": "Restaurant / café", "adresse": "44 Av. Col. Ebeya", "tel": "", "horaires": "", "lat": -4.3087036, "lng": 15.3020598},
  {"nom": "Levantè", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe", "tel": "+243 979 333 332", "horaires": "", "lat": -4.3257743, "lng": 15.2759307, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Limoncello Italian Restaurant", "cat": "restaurant", "type": "Restaurant / café", "adresse": "1 Av; des Etoiles", "tel": "+243 815 141 111", "horaires": "Lun 12h30–22h00 ; Mar fermé ; Mer–Sam 12h30–22h00 ; Dim 12h30–21h30", "lat": -4.3070502, "lng": 15.2902445},
  {"nom": "Mahir Restaurant (indien)", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. du Commerce (Plus Code M8V7+4JF)", "tel": "+243 890 011 755", "horaires": "7j/7 8h–22h", "lat": -4.3071773, "lng": 15.3140472},
  {"nom": "Maison de France", "cat": "restaurant", "type": "Restaurant / café", "adresse": "33, avenue des forces armées", "tel": "+243 999 942 710", "horaires": "Lun–Sam 9h00–22h00 ; Dim 8h00–19h00", "lat": -4.3191065, "lng": 15.2860097, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Maison Des Mezzes", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7VW+3MX)", "tel": "+243 818 998 621", "horaires": "7j/7 9h00–23h00", "lat": -4.3072613, "lng": 15.2967362},
  {"nom": "MOKA & MORE - GOMBE", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7WX+3RH)", "tel": "", "horaires": "Lun–Ven 9h00–12h00 ; Sam–Dim fermé", "lat": -4.3048116, "lng": 15.2996031},
  {"nom": "Muskoka Coffee & Tea House", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7PM+Q7R)", "tel": "+243 829 562 818", "horaires": "Lun–Sam 7h00–21h00 ; Dim 10h00–20h00", "lat": -4.3131039, "lng": 15.2832207},
  {"nom": "Mykonos", "cat": "restaurant", "type": "Restaurant / café", "adresse": "10 Av. Wagenia", "tel": "+243 992 333 337", "horaires": "7j/7 12h00–0h00", "lat": -4.2982089, "lng": 15.3116753},
  {"nom": "NoorTaaj Village Sweets & Snacks", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. du Bas-Congo, en face de la CMK", "tel": "+243 827 000 299", "horaires": "Lun–Sam 8h–22h ; Dim 7h–22h", "lat": -4.3073119, "lng": 15.3148865},
  {"nom": "Papa John's", "cat": "restaurant", "type": "Restaurant / café", "adresse": "30 Avenue De La Gombe", "tel": "+243 848 577 777", "horaires": "7j/7 11h00–23h00", "lat": -4.3183151, "lng": 15.285668, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Patisserie Nouvelle", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M8X6+J93)", "tel": "+243 997 752 134", "horaires": "7j/7 6h30–18h00", "lat": -4.3009997, "lng": 15.310908},
  {"nom": "Pera Resto Drink", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Avenue Colonel Lukusa, No: 6113 Le Premier Shopping Mall, 2. Etage", "tel": "+243 811 606 207", "horaires": "7j/7 13h30–0h00", "lat": -4.3049333, "lng": 15.2996793},
  {"nom": "Pizza Guys DRC (by Burger Guys)", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin (Plus Code M7RR+7JF)", "tel": "+243 900 006 444", "horaires": "7j/7 10h00–23h00", "lat": -4.3093232, "lng": 15.2915398},
  {"nom": "Pizza Inn", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M8JJ+G3W)", "tel": "+243 829 999 998", "horaires": "", "lat": -4.3188273, "lng": 15.3300756, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Pomme (indien)", "cat": "restaurant", "type": "Restaurant / café", "adresse": "44, Av. du Commerce", "tel": "+243 840 008 392", "horaires": "7j/7 8h–22h", "lat": -4.3068811, "lng": 15.3142414},
  {"nom": "Poulet Chaud | Chez Cathy Iloo", "cat": "restaurant", "type": "Restaurant / café", "adresse": "92 Av. Col. Ebeya", "tel": "", "horaires": "", "lat": -4.3081113, "lng": 15.3010302},
  {"nom": "Queen Grill", "cat": "restaurant", "type": "Restaurant / café", "adresse": "44 Avenue De La Démocratie, Kinshasa et Mont des Arts, Av. De La Démocratie", "tel": "+243 841 243 981", "horaires": "Lun–Sam 12h00–21h00 ; Dim 13h34–21h00", "lat": -4.3125518, "lng": 15.3033725},
  {"nom": "Restaurant 3z", "cat": "restaurant", "type": "Restaurant / café", "adresse": "18 Av. Roi Beaudouin", "tel": "+243 816 004 179", "horaires": "7j/7 12h00–23h30", "lat": -4.3051462, "lng": 15.2917329},
  {"nom": "Restaurant Chez LuLu", "cat": "restaurant", "type": "Restaurant / café", "adresse": "4336, Av Prince de liège, Commune de, Quartier Révolution", "tel": "+243 891 179 001", "horaires": "7j/7 11h00–0h00", "lat": -4.3248824, "lng": 15.2860968, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Restaurant Chez Mama Lao", "cat": "restaurant", "type": "Restaurant / café", "adresse": "1003060, Av. Lt. Colonel Lukusa", "tel": "+243 897 915 570", "horaires": "7j/7 12h30–23h00", "lat": -4.3016717, "lng": 15.3079806},
  {"nom": "Restaurant le zaire", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M8W4+34Q)", "tel": "", "horaires": "", "lat": -4.3047981, "lng": 15.3053546},
  {"nom": "Restaurant Les 7 Collines chez Francisca", "cat": "restaurant", "type": "Restaurant / café", "adresse": "55C Av. Kolwezi", "tel": "+243 853 540 191", "horaires": "", "lat": -4.3053532, "lng": 15.2975044},
  {"nom": "Restaurant-Bar (Forces Armées)", "cat": "restaurant", "type": "Restaurant / café", "adresse": "3B, Av. des Forces Armées", "tel": "", "horaires": "", "lat": -4.3032527, "lng": 15.310528},
  {"nom": "Royal Garden", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Bd du 30 Juin", "tel": "+243 830 429 132", "horaires": "7j/7 24h", "lat": -4.3149352, "lng": 15.2831837},
  {"nom": "Saveur d’Afrique", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Gombe (Plus Code M7MF+G3M)", "tel": "", "horaires": "7j/7 12h00–0h00", "lat": -4.3162115, "lng": 15.2727853},
  {"nom": "Sicilia", "cat": "restaurant", "type": "Restaurant / café", "adresse": "River Tower's, 4260 Av. de la Mission", "tel": "+243 859 009 009", "horaires": "Lun–Ven 11h30–23h30 ; Sam 11h30–1h30 ; Dim 11h30–23h30", "lat": -4.3015258, "lng": 15.2988739},
  {"nom": "Snack Away Kinshasa", "cat": "restaurant", "type": "Restaurant / café", "adresse": "7a Av. Du Port", "tel": "+243 997 090 562", "horaires": "7j/7 9h00–22h00", "lat": -4.3029719, "lng": 15.3082569},
  {"nom": "Tandoor Grills & Curries", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Modern Paradise 8225, Av. Kabasele Tshamala", "tel": "+243 810 691 999", "horaires": "Lun fermé ; Mar–Dim 11h00–23h00", "lat": -4.3056993, "lng": 15.3225482},
  {"nom": "The Gourmet Circle", "cat": "restaurant", "type": "Restaurant / café", "adresse": "Av. Du Cercle", "tel": "+243 999 901 002", "horaires": "Lun fermé ; Mar–Sam 12h00–22h00 ; Dim 12h00–21h00", "lat": -4.3133041, "lng": 15.2934063},
  {"nom": "Vilakazi Restaurant Kinshasa", "cat": "restaurant", "type": "Restaurant / café", "adresse": "22 Av. Tombalbaye", "tel": "+243 812 769 071", "horaires": "Lun 15h00–0h00 ; Mar 12h00–0h00 ; Mer 12h00–1h00 ; Jeu 12h30–0h00 ; Ven 12h00–2h00 ; Sam–Dim 12h00–3h00", "lat": -4.3050644, "lng": 15.3144954},
  {"nom": "Ville Nice Cream", "cat": "restaurant", "type": "Restaurant / café", "adresse": "7a Av. Du Port", "tel": "+243 992 854 008", "horaires": "Lun–Ven 8h00–22h30 ; Sam 9h00–23h30 ; Dim 8h00–23h30", "lat": -4.3029933, "lng": 15.3082399},
  {"nom": "Big Boss Lounge", "cat": "bar", "type": "Bar / lounge", "adresse": "Boulevard 30 juin Reference Ex Peloustore", "tel": "+243 822 229 995", "horaires": "7j/7 12h00–23h30", "lat": -4.305459, "lng": 15.3039075},
  {"nom": "Black Gold L’or Noir", "cat": "bar", "type": "Bar / lounge", "adresse": "7a Av. Du Port", "tel": "", "horaires": "7j/7 14h00–3h00", "lat": -4.3029428, "lng": 15.3082594},
  {"nom": "CARRÉ CLUB KINSHASA", "cat": "bar", "type": "Bar / lounge", "adresse": "Gombe", "tel": "", "horaires": "7j/7 15h00–6h00", "lat": -4.3189872, "lng": 15.3297264, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Chacha Bar", "cat": "bar", "type": "Bar / lounge", "adresse": "Gombe (vue sur le fleuve)", "tel": "+243 973 860 001", "horaires": "Lun–Jeu fermé ; Ven–Sam 16h–4h ; Dim 16h–0h", "lat": -4.3007653, "lng": 15.3087668},
  {"nom": "Champagne Lounge Bar Restaurant", "cat": "bar", "type": "Bar / lounge", "adresse": "Av. de la Paix", "tel": "+243 827 771 302", "horaires": "Lun fermé ; Mar–Jeu 15h00–1h00 ; Ven–Sam 15h00–5h00 ; Dim 15h00–4h00", "lat": -4.3019293, "lng": 15.3107235},
  {"nom": "Chez Ntemba", "cat": "bar", "type": "Bar / lounge", "adresse": "1 Av. Lt. Colonel Lukusa", "tel": "+243 995 712 393", "horaires": "Lun fermé ; Mar–Dim 21h00–6h00", "lat": -4.3016718, "lng": 15.3079804},
  {"nom": "Coco Jambo Lounge & Lounge", "cat": "bar", "type": "Bar / lounge", "adresse": "11 Av. De La Presse", "tel": "+243 992 943 911", "horaires": "Lun 9h00–17h00 ; Mar–Jeu 12h00–4h00 ; Ven 14h30–4h00 ; Sam–Dim 12h00–4h00", "lat": -4.3033203, "lng": 15.3129909},
  {"nom": "INDUS Terrace & bar", "cat": "bar", "type": "Bar / lounge", "adresse": "34 Av. Col. Ebeya", "tel": "+243 818 554 749", "horaires": "Lun 12h00–23h00 ; Mar 11h00–23h00 ; Mer–Dim 12h00–23h00", "lat": -4.3053851, "lng": 15.3100404},
  {"nom": "K Lounge", "cat": "bar", "type": "Bar / lounge", "adresse": "124 Bd du 30 Juin", "tel": "+243 897 120 968", "horaires": "Lun–Jeu 12h00–1h00 ; Ven 12h00–2h00 ; Sam 12h00–3h00 ; Dim 12h00–2h00", "lat": -4.3128152, "lng": 15.2851609},
  {"nom": "La Citadelle Restaurent & Lounge", "cat": "bar", "type": "Bar / lounge", "adresse": "2345 avenue mont thabor numéro 04, Quartier Haut Commandement, Commune de", "tel": "+243 852 160 053", "horaires": "7j/7 10h00–0h00", "lat": -4.3190438, "lng": 15.2925994, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "La Datcha", "cat": "bar", "type": "Bar / lounge", "adresse": "16 Avenue du livre, C", "tel": "+243 995 929 551", "horaires": "Lun–Mer 15h00–2h00 ; Jeu 15h00–3h00 ; Ven–Sam 15h00–4h00 ; Dim 15h00–2h00", "lat": -4.3056455, "lng": 15.3053347},
  {"nom": "La Terrasse Kinshasa", "cat": "bar", "type": "Bar / lounge", "adresse": "179 Av. de la Paix", "tel": "+243 841 206 095", "horaires": "Lun fermé ; Mar–Dim 12h00–21h00", "lat": -4.3019506, "lng": 15.3109462},
  {"nom": "Le Bar", "cat": "bar", "type": "Bar / lounge", "adresse": "Gombe (Plus Code M8W4+34Q)", "tel": "", "horaires": "", "lat": -4.3047981, "lng": 15.3053546},
  {"nom": "Le Consulat Restau Bar", "cat": "bar", "type": "Bar / lounge", "adresse": "Av. des Armées", "tel": "+243 814 499 232", "horaires": "7j/7 10h30–4h00", "lat": -4.3145293, "lng": 15.2865821},
  {"nom": "Le klub lounge bar kinshasa", "cat": "bar", "type": "Bar / lounge", "adresse": "c/gombe, 8 Av. Isiro", "tel": "+243 810 001 899", "horaires": "", "lat": -4.3016508, "lng": 15.3138709},
  {"nom": "Le Petit Bistro", "cat": "bar", "type": "Bar / lounge", "adresse": "1 Av. Lt. Colonel Lukusa", "tel": "+243 829 168 008", "horaires": "Lun–Jeu 11h00–23h00 ; Ven–Sam 24h ; Dim fermé", "lat": -4.3016718, "lng": 15.3079804},
  {"nom": "Le Premium Club", "cat": "bar", "type": "Bar / lounge", "adresse": "98 Av. Col. Ebeya (Plus Code M8R2+Q3)", "tel": "+243 842 953 585", "horaires": "7j/7 24h", "lat": -4.3080387, "lng": 15.300146},
  {"nom": "Les retrouvailles chez gloria", "cat": "bar", "type": "Bar / lounge", "adresse": "Av. de la Paix (Plus Code M8X6+7FC)", "tel": "", "horaires": "Lun–Jeu 9h00–23h30 ; Ven–Sam 9h00–0h00 ; Dim 17h00–0h00", "lat": -4.3018214, "lng": 15.3111293},
  {"nom": "Les vins du monde", "cat": "bar", "type": "Bar / lounge", "adresse": "dans la commune de, 20 avenue de la caisse d'épargne", "tel": "+243 862 981 154", "horaires": "Lun–Jeu 9h00–1h30 ; Ven–Sam 9h30–1h30 ; Dim 10h30–20h30", "lat": -4.3060416, "lng": 15.289335},
  {"nom": "Licious Vip Lounge Bar", "cat": "bar", "type": "Bar / lounge", "adresse": "Av. de la Justice (Plus Code M7PH+2RX)", "tel": "+243 847 685 733", "horaires": "7j/7 12h00–6h00", "lat": -4.3148847, "lng": 15.2796163},
  {"nom": "L’Atmosphère Night-Club", "cat": "bar", "type": "Bar / lounge", "adresse": "4 Av. des Batetela", "tel": "+243 815 815 063", "horaires": "Lun–Mar fermé ; Mer–Dim 20h00–5h00", "lat": -4.3126815, "lng": 15.273243},
  {"nom": "L’Olive Verte", "cat": "bar", "type": "Bar / lounge", "adresse": "22 Avenue Comité Urbain", "tel": "+243 820 625 268", "horaires": "Lun fermé ; Mar–Dim 12h00–0h00", "lat": -4.3076193, "lng": 15.2884453},
  {"nom": "New Standing Club", "cat": "bar", "type": "Bar / lounge", "adresse": "Gombe (Plus Code M8VF+38C)", "tel": "+243 999 996 720", "horaires": "Lun fermé ; Mar–Dim 18h00–6h00", "lat": -4.3073158, "lng": 15.323264},
  {"nom": "Nexxt club", "cat": "bar", "type": "Bar / lounge", "adresse": "Gombe (Plus Code M8V5+PWF)", "tel": "+243 999 814 140", "horaires": "Lun–Sam 14h00–7h00 ; Dim 15h00–6h00", "lat": -4.3056765, "lng": 15.3097845},
  {"nom": "PAPILLON CAFÉ BAR", "cat": "bar", "type": "Bar / lounge", "adresse": "20 Av. de la Paix", "tel": "+243 856 261 433", "horaires": "Lun–Ven 9h00–20h00 ; Sam 10h00–20h00 ; Dim 9h00–20h00", "lat": -4.3018665, "lng": 15.3106307},
  {"nom": "Planète J", "cat": "bar", "type": "Bar / lounge", "adresse": "26 Av. de l'Equateur", "tel": "+243 851 832 072", "horaires": "7j/7 24h", "lat": -4.3027161, "lng": 15.3105473},
  {"nom": "RESTAURANT MOOD OFFICIEL", "cat": "bar", "type": "Bar / lounge", "adresse": "Immeuble Rose, 876 sur, 876 Av. de la Justice", "tel": "+243 820 701 846", "horaires": "Lun–Sam 7h00–2h00 ; Dim 12h00–23h30", "lat": -4.3133393, "lng": 15.2831968},
  {"nom": "Appart24", "cat": "hotel", "type": "Hôtel", "adresse": "18 Avenue de la Libération", "tel": "+243 815 066 895", "horaires": "", "lat": -4.3266979, "lng": 15.2959218, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Béatrice Hôtel", "cat": "hotel", "type": "Hôtel", "adresse": "1, Av. Isiro (près de la Gare Centrale)", "tel": "+243 812 535 000", "horaires": "7j/7 0h–23h", "lat": -4.3002323, "lng": 15.3175384},
  {"nom": "Flat Hôtel BEVERLY LODGE", "cat": "hotel", "type": "Hôtel", "adresse": "Mpeti Apartments, 9 Av. Mpeti", "tel": "+243 896 939 007", "horaires": "", "lat": -4.3209757, "lng": 15.2818409, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Four Points by Sheraton Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "1 A Av. Mbuji-Mayi", "tel": "+243 996 081 125", "horaires": "", "lat": -4.3063028, "lng": 15.2958413},
  {"nom": "Grand Residence", "cat": "hotel", "type": "Hôtel", "adresse": "Gombe, n° 9510, Croisement des Avenues des Cliniques, et Batetela", "tel": "+243 978 444 444", "horaires": "Lun–Ven 9h00–17h00 ; Sam 9h00–16h00 ; Dim fermé", "lat": -4.3140348, "lng": 15.2761118},
  {"nom": "GREEN LODGE (Kinshasa)", "cat": "hotel", "type": "Hôtel", "adresse": "24 Av. Des Senegalais", "tel": "+243 859 804 913", "horaires": "7j/7 24h", "lat": -4.3063946, "lng": 15.318982},
  {"nom": "Guest House Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "Gombe (Plus Code M8W6+M6R)", "tel": "", "horaires": "", "lat": -4.3032527, "lng": 15.310528},
  {"nom": "Guest House Sunny Day", "cat": "hotel", "type": "Hôtel", "adresse": "Avenue Avenue Comité Urbain 28/30 (Ex Colonel Vangu)", "tel": "+243 999 906 425", "horaires": "7j/7 24h", "lat": -4.3080355, "lng": 15.2878884},
  {"nom": "Hilton Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "10, Av. Wagenia", "tel": "+243 815 590 080", "horaires": "", "lat": -4.298516, "lng": 15.312124},
  {"nom": "Hotel Bella Riva", "cat": "hotel", "type": "Hôtel", "adresse": "Croisement des Av. de la Mission et Kalemie, 12 Av. de la Mission", "tel": "+243 829 785 748", "horaires": "", "lat": -4.3037918, "lng": 15.2987637},
  {"nom": "Hotel Belle Vie", "cat": "hotel", "type": "Hôtel", "adresse": "16 Av. Tombalbaye", "tel": "+243 976 050 000", "horaires": "", "lat": -4.3048651, "lng": 15.3153933},
  {"nom": "Hotel Elais", "cat": "hotel", "type": "Hôtel", "adresse": "Gombe", "tel": "+243 820 050 068", "horaires": "", "lat": -4.3043133, "lng": 15.3030988},
  {"nom": "Hotel Fortune", "cat": "hotel", "type": "Hôtel", "adresse": "Av. Col. Ebeya (Plus Code M8W8+9G6)", "tel": "+243 810 004 268", "horaires": "", "lat": -4.3040827, "lng": 15.3162532},
  {"nom": "Hotel Golf Coast", "cat": "hotel", "type": "Hôtel", "adresse": "Avenue Citronier N° 13, Q/Criux rouge", "tel": "+243 999 992 606", "horaires": "", "lat": -4.3131028, "lng": 15.2925323},
  {"nom": "Hotel Kin Comfort", "cat": "hotel", "type": "Hôtel", "adresse": "37 Mpolo", "tel": "+243 902 683 170", "horaires": "7j/7 24h", "lat": -4.3054864, "lng": 15.306542},
  {"nom": "Hotel Kirikou", "cat": "hotel", "type": "Hôtel", "adresse": "Croisement des avenues Haut-Congo et Bakongo, n° 1. Commune de Gombe Haut Congo Kinshasa, Gombe", "tel": "+243 991 307 377", "horaires": "", "lat": -4.3059191, "lng": 15.3144742},
  {"nom": "Hotel Pour Vous", "cat": "hotel", "type": "Hôtel", "adresse": "Gallerie Pacha, 22 Av. Rep Du Tchad", "tel": "+243 891 008 786", "horaires": "7j/7 24h", "lat": -4.3045822, "lng": 15.3120894},
  {"nom": "Hotel Royal", "cat": "hotel", "type": "Hôtel", "adresse": "3 Av. Kitona", "tel": "+243 815 555 666", "horaires": "", "lat": -4.3058989, "lng": 15.3058853},
  {"nom": "Hôtel Chez Belle Vie Boulevard du 30 juin", "cat": "hotel", "type": "Hôtel", "adresse": "Bd du 30 Juin (Plus Code M7VW+86C)", "tel": "+243 816 367 421", "horaires": "", "lat": -4.3066789, "lng": 15.2955228},
  {"nom": "Ibis Styles Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "1 Bd du 30 Juin", "tel": "+243 890 809 921", "horaires": "", "lat": -4.3027952, "lng": 15.3134987},
  {"nom": "KertelSuites", "cat": "hotel", "type": "Hôtel", "adresse": "9 Av. De La Mongala", "tel": "+243 990 999 957", "horaires": "7j/7 24h", "lat": -4.3032855, "lng": 15.3068752},
  {"nom": "Kin city appart/ gombe", "cat": "hotel", "type": "Hôtel", "adresse": "Gombe (Plus Code M8W4+34Q)", "tel": "", "horaires": "", "lat": -4.3047981, "lng": 15.3053546},
  {"nom": "Leon Hotel", "cat": "hotel", "type": "Hôtel", "adresse": "41 Av. Luambo Makiadi", "tel": "+243 813 209 121", "horaires": "7j/7 24h", "lat": -4.3030977, "lng": 15.3139028},
  {"nom": "Lux Inn Hotel", "cat": "hotel", "type": "Hôtel", "adresse": "Av. Katanga, 87, Croise Bd du 30 Juin", "tel": "+243 900 000 047", "horaires": "", "lat": -4.3066185, "lng": 15.294519},
  {"nom": "Maison d'accueil Saint Eloi (Saint Eloi Guest House)", "cat": "hotel", "type": "Hôtel", "adresse": "4511 Bokango Urbanisme", "tel": "+243 973 399 851", "horaires": "", "lat": -4.3187422, "lng": 15.3306659, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Novotel Kinshasa La Gombe", "cat": "hotel", "type": "Hôtel", "adresse": "76 Av. Bandundu", "tel": "+243 840 655 111", "horaires": "", "lat": -4.3040594, "lng": 15.3051907},
  {"nom": "O'Castelo Hotel, KINSHASA", "cat": "hotel", "type": "Hôtel", "adresse": "Gombe (Plus Code M7GJ+JJP)", "tel": "+39 347 119 1965", "horaires": "", "lat": -4.3234156, "lng": 15.281573, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Protea Hotel by Marriott Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "En face: Casier Judiciaire, Commune de la Gombe, 8 Av. Kalemie", "tel": "+243 903 009 121", "horaires": "", "lat": -4.3026728, "lng": 15.2987973},
  {"nom": "Ranzol Guest House", "cat": "hotel", "type": "Hôtel", "adresse": "Av. de L'ecole (Plus Code M8V7+93H)", "tel": "+243 811 447 069", "horaires": "", "lat": -4.3065558, "lng": 15.3127317},
  {"nom": "Relax Hôtel", "cat": "hotel", "type": "Hôtel", "adresse": "Av. Colonel Ebeya", "tel": "+243 897 000 045", "horaires": "7j/7 5h–0h", "lat": -4.3040583, "lng": 15.3159643},
  {"nom": "Riverside Suites Kinshasa", "cat": "hotel", "type": "Hôtel", "adresse": "8 Av. Kalemie", "tel": "+243 825 122 636", "horaires": "7j/7 9h00–17h30", "lat": -4.3030818, "lng": 15.2989441},
  {"nom": "Salem GuestHouse", "cat": "hotel", "type": "Hôtel", "adresse": "245 Avenue du Golf Commune de", "tel": "+243 970 001 001", "horaires": "", "lat": -4.3095347, "lng": 15.2926308},
  {"nom": "Cathédrale Notre-Dame Du Congo", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Av. Du 24 Novembre (Plus Code M7GV+FR4)", "tel": "", "horaires": "", "lat": -4.3238666, "lng": 15.2945697, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Centre Missionnaire Philadelphie", "cat": "culte", "type": "Église / lieu de culte", "adresse": "4935, 00243 Av. de la Science", "tel": "+243 827 051 400", "horaires": "Lun–Mar fermé ; Mer–Jeu 17h30–19h30 ; Ven–Sam fermé ; Dim 7h00–8h30, 9h30–11h00, 12h00–13h30", "lat": -4.3245312, "lng": 15.2846616, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Church of Our Lady of Fatima", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Ecole Notre Dame De Fatima, 1356 Av. TomBalbaye", "tel": "+243 815 256 391", "horaires": "", "lat": -4.3096093, "lng": 15.2999505},
  {"nom": "Eglise CECA 20 GOMBE", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Av. de la Science (Plus Code M7GQ+M63)", "tel": "+243 811 439 412", "horaires": "Lun–Mar fermé ; Mer 24h ; Jeu fermé ; Ven 24h ; Sam fermé ; Dim 24h", "lat": -4.3233591, "lng": 15.2880405, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "EGLISE PENTECOTISTE FRANCOPHONE DE LA GOMBE GOSHEN (EPFG GOSHEN)", "cat": "culte", "type": "Église / lieu de culte", "adresse": "1 Avenue Kasa-Vubu (Plus Code M8Q4+MQJ)", "tel": "+243 998 178 104", "horaires": "Lun–Mar fermé ; Mer 17h00–19h30 ; Jeu fermé ; Ven 17h00–19h30 ; Sam fermé ; Dim 8h30–11h30", "lat": -4.3115453, "lng": 15.3080812},
  {"nom": "Mosque Shia Ithnaasheri", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M7J9+XF4)", "tel": "", "horaires": "", "lat": -4.3176082, "lng": 15.2686908, "emoji": "🕌"},
  {"nom": "Mosquee", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Av. De L'Oms (Plus Code M7RQ+J88)", "tel": "", "horaires": "", "lat": -4.3084582, "lng": 15.2883324, "emoji": "🕌"},
  {"nom": "Mosquée", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M7HJ+PW8)", "tel": "", "horaires": "", "lat": -4.3207148, "lng": 15.2823284, "emoji": "🕌", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Mosquée Centrale d'Usoke", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M8M6+RJ5)", "tel": "", "horaires": "7j/7 24h", "lat": -4.3154895, "lng": 15.3115963, "emoji": "🕌"},
  {"nom": "Mosquée communauté musulmane du Congo", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M8C3+627)", "tel": "", "horaires": "", "lat": -4.3294045, "lng": 15.3026049, "emoji": "🕌", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Parole Du Salut", "cat": "culte", "type": "Église / lieu de culte", "adresse": "80 Av. Des Cliniques", "tel": "+243 828 501 001", "horaires": "Lun 17h00–19h00 ; Mar 8h00–19h00 ; Mer 17h00–19h00 ; Jeu 8h00–16h00 ; Ven 17h00–19h00 ; Sam 16h30–0h00 ; Dim 8h00–10h00, 10h30–12h30", "lat": -4.3155547, "lng": 15.2748219},
  {"nom": "Sacred Heart Parish", "cat": "culte", "type": "Église / lieu de culte", "adresse": "2 Av. Père Boka", "tel": "", "horaires": "Lun fermé ; Mar 16h30–18h00 ; Mer–Ven fermé ; Sam 16h30–18h30 ; Dim 8h30–18h30", "lat": -4.3080126, "lng": 15.2843092},
  {"nom": "St Anne's Church", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Avenue des Aviateurs (Plus Code M8X8+J4R)", "tel": "", "horaires": "", "lat": -4.3008814, "lng": 15.315268},
  {"nom": "Église Adventiste du 7e Jour Gombe", "cat": "culte", "type": "Église / lieu de culte", "adresse": "64, Bd du 30 Juin", "tel": "+243 835 954 926", "horaires": "", "lat": -4.3065297, "lng": 15.2970024},
  {"nom": "Église Chapelle des Vainqueurs Gombe", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M8Q2+7QV)", "tel": "", "horaires": "", "lat": -4.3117591, "lng": 15.3019367},
  {"nom": "Église Miesa Gombe", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe (Plus Code M8R3+C9)", "tel": "", "horaires": "", "lat": -4.3090097, "lng": 15.3034336},
  {"nom": "Église MISSA", "cat": "culte", "type": "Église / lieu de culte", "adresse": "Gombe", "tel": "+243 838 363 967", "horaires": "7j/7 24h", "lat": -4.3032527, "lng": 15.310528},
  {"nom": "Blue Padel", "cat": "sport", "type": "Sport", "adresse": "12 Av. Kalemie", "tel": "+243 992 069 302", "horaires": "Lun–Mer 9h00–22h00 ; Jeu–Sam 9h00–23h00 ; Dim 9h00–22h00", "lat": -4.3031426, "lng": 15.297969},
  {"nom": "Bsk Stadium", "cat": "sport", "type": "Sport", "adresse": "Av. des Mandariniers (Plus Code M7PR+XQC)", "tel": "+243 815 000 001", "horaires": "7j/7 5h00–22h00", "lat": -4.3125628, "lng": 15.2918828},
  {"nom": "Cercle de Kinshasa", "cat": "sport", "type": "Sport", "adresse": "441 Av. Du Cercle", "tel": "+243 814 834 998", "horaires": "7j/7 6h00–22h00", "lat": -4.3113417, "lng": 15.2919991},
  {"nom": "Cercle de Kinshasa – Golf (et tennis)", "cat": "sport", "type": "Sport", "adresse": "Place Kasa-Vubu (Plus Code M7QW+8M6)", "tel": "+243 843 964 402", "horaires": "7j/7 6h–20h", "lat": -4.3117041, "lng": 15.2966394},
  {"nom": "Cercle Sportif & Récréatif Kalina Club", "cat": "sport", "type": "Sport", "adresse": "05 Av. des Batetela", "tel": "", "horaires": "Lun–Jeu 7h00–22h00 ; Ven–Dim 8h00–23h00", "lat": -4.3127705, "lng": 15.2753701},
  {"nom": "DYNAFIT KINSHASA", "cat": "sport", "type": "Sport", "adresse": "876Av. de la Justice, immeuble rose au 2eme étages, Av. de la Justice", "tel": "+243 907 663 399", "horaires": "Lun–Sam 6h00–22h00 ; Dim 10h00–18h00", "lat": -4.3131181, "lng": 15.283035},
  {"nom": "Fitness Club Move Your Body And Smile", "cat": "sport", "type": "Sport", "adresse": "3438 Wagenia Garage central Onatra, Av. Wagenia", "tel": "+243 830 000 068", "horaires": "Lun–Ven 6h00–21h00 ; Sam–Dim 6h00–16h00", "lat": -4.2989917, "lng": 15.309441},
  {"nom": "Fitness First Kinshasa", "cat": "sport", "type": "Sport", "adresse": "Select Shopping Mall No. 1 Croisement Avenue de la Paix et, Av. de l'Equateur", "tel": "+243 821 716 441", "horaires": "Lun–Sam 6h30–22h00 ; Dim 8h00–20h00", "lat": -4.301353, "lng": 15.3146346},
  {"nom": "Fitness2000 Kinshasa", "cat": "sport", "type": "Sport", "adresse": "Cercle Elaeis, Av. Lt. Colonel Lukusa", "tel": "+243 993 339 224", "horaires": "Lun–Ven 6h00–22h00 ; Sam–Dim 9h00–22h00", "lat": -4.3039014, "lng": 15.3031106},
  {"nom": "Monama Yoga Studio", "cat": "sport", "type": "Sport", "adresse": "414, Av. du Cercle", "tel": "+243 816 209 461", "horaires": "Lun–Ven 8h–19h30 ; Sam 11h–13h ; Dim fermé", "lat": -4.3115485, "lng": 15.2919069},
  {"nom": "OJ Fitness", "cat": "sport", "type": "Sport", "adresse": "8 Av. Kalemie", "tel": "+243 814 637 171", "horaires": "Lun–Ven 6h30–21h00 ; Sam–Dim 7h30–18h30", "lat": -4.303082, "lng": 15.2989443},
  {"nom": "Stade Cardinal Malula", "cat": "sport", "type": "Sport", "adresse": "Gombe (Plus Code M8G7+W5P)", "tel": "", "horaires": "Lun–Ven 8h30–17h00 ; Sam 8h30–15h30 ; Dim fermé", "lat": -4.322656, "lng": 15.3129519, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Terrain de basket Collège Bosembo", "cat": "sport", "type": "Sport", "adresse": "Av. de la Science (Plus Code M7HR+3R6)", "tel": "", "horaires": "", "lat": -4.3223418, "lng": 15.2920266, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Terrain de basket du Shark Club", "cat": "sport", "type": "Sport", "adresse": "Gombe (Plus Code M7QF+4RQ)", "tel": "+243 977 009 872", "horaires": "", "lat": -4.3121519, "lng": 15.2746033},
  {"nom": "Terrain de basket Huawei", "cat": "sport", "type": "Sport", "adresse": "Gombe (Plus Code M8X8+XMH)", "tel": "", "horaires": "", "lat": -4.3000595, "lng": 15.3167416},
  {"nom": "Terrain de basket ISP", "cat": "sport", "type": "Sport", "adresse": "2, Av. Père Boka", "tel": "", "horaires": "", "lat": -4.3071808, "lng": 15.2856141},
  {"nom": "Terrain de basket SAFAK", "cat": "sport", "type": "Sport", "adresse": "3, Av. Zongo-Ntolo", "tel": "", "horaires": "", "lat": -4.3084069, "lng": 15.2776843},
  {"nom": "Terrain Flamboyant", "cat": "sport", "type": "Sport", "adresse": "Av. Des Flamboyants (Plus Code M7PQ+P66)", "tel": "+243 813 066 080", "horaires": "", "lat": -4.3132093, "lng": 15.2880099},
  {"nom": "Ultras football center", "cat": "sport", "type": "Sport", "adresse": "Av. de la Science (Plus Code M7GQ+CQ9)", "tel": "+243 851 999 991", "horaires": "Lun 14h00–18h30 ; Mar–Jeu 15h00–18h30 ; Ven 10h00–18h00 ; Sam 9h00–18h00 ; Dim 9h00–20h30", "lat": -4.3239599, "lng": 15.2894963, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Alpha PHARMACY", "cat": "pharmacie", "type": "Pharmacie", "adresse": "119 Bd du 30 Juin", "tel": "+243 891 379 175", "horaires": "Lun–Sam 8h00–22h00 ; Dim 8h00–21h00", "lat": -4.3092783, "lng": 15.2916085},
  {"nom": "Hélène Pharmacie", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Gombe", "tel": "+243 971 365 262", "horaires": "Lun–Ven 9h00–19h00 ; Sam 10h00–19h30 ; Dim fermé", "lat": -4.3063992, "lng": 15.3234826},
  {"nom": "Magnus Pharma", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Basoko (Plus Code M8VC+2J4)", "tel": "+243 814 939 953", "horaires": "", "lat": -4.3074768, "lng": 15.3215727},
  {"nom": "MANAL PHARMACY", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Gare centrale, n8 Av. Des Senegalais", "tel": "+243 855 550 507", "horaires": "Lun–Sam 8h00–22h00 ; Dim 0h00–22h00", "lat": -4.3030485, "lng": 15.3180715},
  {"nom": "New Life", "cat": "pharmacie", "type": "Pharmacie", "adresse": "10 Av. Mutombo Katshi", "tel": "", "horaires": "", "lat": -4.3023744, "lng": 15.3091698},
  {"nom": "New Pharmacie des Cliniques", "cat": "pharmacie", "type": "Pharmacie", "adresse": "012 79, Avenue des cliniques, C, 79 Av. Des Cliniques", "tel": "+243 815 022 132", "horaires": "7j/7 24h", "lat": -4.3151203, "lng": 15.2748661},
  {"nom": "Pharmabel", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Gombe (Plus Code M8X7+592)", "tel": "+243 998 222 221", "horaires": "7j/7 24h", "lat": -4.3021137, "lng": 15.3133995},
  {"nom": "Pharmacie (sans nom)", "cat": "pharmacie", "type": "Pharmacie", "adresse": "51, Av. Tombalbaye", "tel": "", "horaires": "", "lat": -4.3043846, "lng": 15.3181299},
  {"nom": "Pharmacie Beas", "cat": "pharmacie", "type": "Pharmacie", "adresse": "10 Av. Wagenia", "tel": "", "horaires": "7j/7 24h", "lat": -4.299685, "lng": 15.31406},
  {"nom": "Pharmacie DE L'INDEPENDANCE", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Boulvard du 30juin En face de la, grande poste", "tel": "+243 850 444 444", "horaires": "Lun–Sam 8h30–21h00 ; Dim 9h00–21h00", "lat": -4.3038602, "lng": 15.3076734},
  {"nom": "Pharmacie du 30 Juin", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Bd du 30 Juin (Plus Code M8W6+P67)", "tel": "", "horaires": "", "lat": -4.3032154, "lng": 15.3105518},
  {"nom": "Pharmacie ESPOIR FAUSTIN", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Kinshasa C Gombe / Boulevard du 30 juin, No 8 immuble Mayombe, a cote de jeffery travels, Bd du 30 Juin", "tel": "+243 900 764 338", "horaires": "Lun–Sam 8h30–21h00 ; Dim 9h00–21h00", "lat": -4.3061102, "lng": 15.2984063},
  {"nom": "Pharmacie le Vainqueur", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Av. Kasa-Vubu (Plus Code M8F7+X3V)", "tel": "", "horaires": "", "lat": -4.325, "lng": 15.3126652, "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Pharmacie Saint Boaz 4", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Gombe, Kinshasa, République démocratique du, Bd du 30 Juin", "tel": "+243 816 015 601", "horaires": "", "lat": -4.3072132, "lng": 15.2956824},
  {"nom": "PHARMACIE SALAMA", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Immeuble moulaert", "tel": "+243 996 710 582", "horaires": "7j/7 24h", "lat": -4.3033707, "lng": 15.3108807},
  {"nom": "Pharmacie Towers", "cat": "pharmacie", "type": "Pharmacie", "adresse": "9, Av. Kalemie, en face de la Police judiciaire", "tel": "+243 900 118 114", "horaires": "Lun–Sam 8h–21h ; Dim fermé", "lat": -4.3032724, "lng": 15.2988586},
  {"nom": "Pharmacie Venue", "cat": "pharmacie", "type": "Pharmacie", "adresse": "Rond Point Forescom, 15 Av. de la Paix", "tel": "", "horaires": "", "lat": -4.3014474, "lng": 15.3090748},
  {"nom": "Pharmans , Dépôt Pharmaceutique", "cat": "pharmacie", "type": "Pharmacie", "adresse": "40 Avenue du Commerce", "tel": "+243 852 591 175", "horaires": "Lun–Ven 8h00–16h00 ; Sam 8h00–13h00 ; Dim fermé", "lat": -4.3067685, "lng": 15.3147198},
  {"nom": "Saint Clément Pharma", "cat": "pharmacie", "type": "Pharmacie", "adresse": "112, Av. Bas-Congo, Q/ Révolution, derrière la Grande Poste", "tel": "+243 832 922 293", "horaires": "Lun–Sam 8h30–19h30 ; Dim fermé", "lat": -4.3051991, "lng": 15.3073981},
  {"nom": "Élit pharm", "cat": "pharmacie", "type": "Pharmacie", "adresse": "local 10, Kavali Center, en diagonale du 5 à sec, A15 Av. de la Paix", "tel": "+243 815 362 255", "horaires": "7j/7 7h30–21h30", "lat": -4.3017693, "lng": 15.3102251},
  {"nom": "Torikago Lounge Bar", "cat": "bar", "type": "Bar / lounge", "adresse": "179 Av. de la Paix", "tel": "+243 827 771 302", "horaires": "Lun 6h00–1h00 ; Mar–Mer 18h00–1h00 ; Jeu 18h00–0h00 ; Ven 18h00–3h00 ; Sam–Dim 6h00–3h00", "lat": -4.3022079, "lng": 15.310848},
  // ---- Divertissement, formation, activités ajoutés le 2026-10-09 ----
  {"nom": "Millionaire Club", "cat": "bar", "type": "Bar / lounge / boîte de nuit", "adresse": "95, Bd du 30 Juin", "tel": "+243 894 799 886", "horaires": "Lun–Jeu fermé ; Ven–Dim 20h00–5h00", "lat": -4.3072817, "lng": 15.2960838},
  {"nom": "Au bord du fleuve (point de vue)", "cat": "loisirs", "type": "Bateau / bord du fleuve", "adresse": "Av. du Fleuve Congo (Plus Code M7WP+CGP)", "tel": "+243 830 682 518", "horaires": "", "lat": -4.3039283, "lng": 15.2869583, "emoji": "🚤"},
  {"nom": "Majestic River", "cat": "loisirs", "type": "Bateau / bord du fleuve", "adresse": "Av. Kalemie, bord du fleuve (Plus Code M7WR+F5M)", "tel": "+243 817 778 898", "horaires": "Lun fermé ; Mar–Dim 12h00–23h00", "lat": -4.3037841, "lng": 15.2904206, "emoji": "🚤", "remarque": "Entrée réelle ~100 m à l'est du point Google"},
  {"nom": "Picasso Beach", "cat": "loisirs", "type": "Bateau / bord du fleuve", "adresse": "Picasso beach, Av. Du Haut Congo", "tel": "+243 850 590 052", "horaires": "", "lat": -4.3060051, "lng": 15.3140382, "emoji": "🚤"},
  {"nom": "Caesars Casino and Club", "cat": "loisirs", "type": "Casino", "adresse": "Av. de la Gombe", "tel": "+243 820 908 832", "horaires": "7j/7 24h", "lat": -4.319418, "lng": 15.2767991, "emoji": "🎰", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Casino International (Pullman)", "cat": "loisirs", "type": "Casino", "adresse": "Pullman Grand Hôtel, 4 Av. des Batetela", "tel": "+243 970 797 976", "horaires": "7j/7 24h", "lat": -4.3128166, "lng": 15.2743547, "emoji": "🎰"},
  {"nom": "Casino Royal", "cat": "loisirs", "type": "Casino", "adresse": "Av. de l'Étoile (Plus Code M7VQ+QG3)", "tel": "+243 993 003 393", "horaires": "7j/7 24h", "lat": -4.3056143, "lng": 15.2888077, "emoji": "🎰"},
  {"nom": "Casino Salut", "cat": "loisirs", "type": "Casino", "adresse": "948, Av. du Haut-Congo", "tel": "+243 897 139 295", "horaires": "7j/7 24h", "lat": -4.3073928, "lng": 15.3087199, "emoji": "🎰"},
  {"nom": "Congo Trade Centre (CTC)", "cat": "loisirs", "type": "Centre commercial / loisirs", "adresse": "Av. Wagenia", "tel": "+243 818 041 470", "horaires": "Lun–Ven 8h30–16h30 ; Sam–Dim fermé", "lat": -4.2984744, "lng": 15.3116993, "emoji": "🛍️"},
  {"nom": "Galerie La Fontaine", "cat": "loisirs", "type": "Centre commercial / loisirs", "adresse": "Av. des Batetela (Plus Code M7PG+F9R)", "tel": "+243 829 257 813", "horaires": "Lun–Ven 7h30–18h30 ; Sam 24h ; Dim 7h30–21h30", "lat": -4.3138125, "lng": 15.2759375, "emoji": "🛍️"},
  {"nom": "Galleria Mall", "cat": "loisirs", "type": "Centre commercial / loisirs", "adresse": "Avenue Lukusa (Plus Code M7WX+9R5)", "tel": "+243 899 338 668", "horaires": "", "lat": -4.3041114, "lng": 15.2996022, "emoji": "🛍️"},
  {"nom": "Kinshasa Mall", "cat": "loisirs", "type": "Centre commercial / loisirs", "adresse": "Av. du 24 Novembre (Plus Code M7MR+VH9)", "tel": "+243 990 854 519", "horaires": "Lun 8h00–0h00 ; Mar–Jeu 8h00–23h00 ; Ven 24h ; Sam–Dim 8h00–23h00", "lat": -4.3155242, "lng": 15.2916478, "emoji": "🛍️"},
  {"nom": "Le Premier Shopping Mall", "cat": "loisirs", "type": "Centre commercial / loisirs", "adresse": "Av. Lt. Colonel Lukusa (Plus Code M7WX+2VM)", "tel": "+243 900 006 133", "horaires": "7j/7 10h00–22h00", "lat": -4.3049028, "lng": 15.2996697, "emoji": "🛍️"},
  {"nom": "Centre Culturel Boboto", "cat": "loisirs", "type": "Centre culturel", "adresse": "7, Av. Père Boka", "tel": "+243 841 209 273", "horaires": "", "lat": -4.3076836, "lng": 15.2860272, "emoji": "🎭"},
  {"nom": "Centre Culturel Congolais", "cat": "loisirs", "type": "Centre culturel", "adresse": "1, Av. Kasa-Vubu (Plus Code M8Q4+MQJ)", "tel": "+243 996 567 066", "horaires": "", "lat": -4.3108125, "lng": 15.3069375, "emoji": "🎭"},
  {"nom": "Centre Culturel Congolais Le Zoo", "cat": "loisirs", "type": "Centre culturel", "adresse": "1, Av. Kasa-Vubu", "tel": "", "horaires": "", "lat": -4.3115654, "lng": 15.3080868, "emoji": "🎭"},
  {"nom": "Centre culturel Wallonie-Bruxelles", "cat": "loisirs", "type": "Centre culturel", "adresse": "Av. des Aviateurs (Plus Code M8X6+PHW)", "tel": "", "horaires": "", "lat": -4.3006369, "lng": 15.3114589, "emoji": "🎭"},
  {"nom": "Halle de la Gombe (Institut Français)", "cat": "loisirs", "type": "Centre culturel", "adresse": "33, Av. de la Gombe", "tel": "+243 851 074 413", "horaires": "", "lat": -4.3187136, "lng": 15.287244, "emoji": "🎭", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Kinshasa United (espace culture et sport jeunes)", "cat": "loisirs", "type": "Centre culturel", "adresse": "5, Av. de la Science", "tel": "+243 819 311 218", "horaires": "", "lat": -4.3225007, "lng": 15.2940008, "emoji": "🎭", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Texaf Bilembo", "cat": "loisirs", "type": "Centre culturel", "adresse": "1, Av. Colonel Mondjiba", "tel": "+243 818 785 072", "horaires": "Lun fermé ; Mar–Sam 9h00–16h30 ; Dim 10h00–13h00", "lat": -4.3213986, "lng": 15.2720668, "emoji": "🎭", "remarque": "Limite ouest de la Gombe (à vérifier)"},
  {"nom": "Cinekin (salle du Collège Boboto)", "cat": "loisirs", "type": "Cinéma", "adresse": "Collège Boboto, Av. Père Boka (Plus Code M7RP+RCP)", "tel": "", "horaires": "Lun–Jeu fermé ; Ven–Dim 15h00–22h00", "lat": -4.3079119, "lng": 15.2860885, "emoji": "🎬"},
  {"nom": "CTC Cinéma Kin RDC", "cat": "loisirs", "type": "Cinéma", "adresse": "Congo Trade Centre (CTC), 10 Av. Wagenia", "tel": "+243 892 412 952", "horaires": "Lun fermé ; Mar–Dim 15h00–20h30", "lat": -4.2984744, "lng": 15.3120828, "emoji": "🎬"},
  {"nom": "Galerie Bandombe", "cat": "loisirs", "type": "Galerie d'art", "adresse": "Building Somip, 34 Av. du Commerce / Lokele", "tel": "+243 858 938 328", "horaires": "Lun–Ven 10h00–17h00 ; Sam–Dim fermé", "lat": -4.3058063, "lng": 15.317983, "emoji": "🖼️"},
  {"nom": "Coco Jambo (bowling, billard, tir à l'arc)", "cat": "loisirs", "type": "Jeux / bowling", "adresse": "11, Av. de la Presse", "tel": "+243 992 943 911", "horaires": "Lun 9h00–17h00 ; Mar–Dim 12h00–4h00", "lat": -4.3033203, "lng": 15.3129909, "emoji": "🎳"},
  {"nom": "Kin Bowling", "cat": "loisirs", "type": "Jeux / bowling", "adresse": "Gombe (Plus Code M8V2+Q4Q)", "tel": "+243 817 862 505", "horaires": "Lun–Jeu 10h30–23h00 ; Ven–Sam 10h30–0h00 ; Dim 12h30–0h00", "lat": -4.3055288, "lng": 15.300373, "emoji": "🎳", "remarque": "Avis récent : peut-être fermé"},
  {"nom": "MafraLand Park", "cat": "loisirs", "type": "Jeux enfants", "adresse": "Av. Kisangani (Plus Code M7RP+QJR)", "tel": "", "horaires": "", "lat": -4.3080055, "lng": 15.2865168, "emoji": "🧸"},
  {"nom": "We Play (Kinshasa Mall)", "cat": "loisirs", "type": "Jeux enfants", "adresse": "Kinshasa Mall, Av. du 24 Novembre", "tel": "", "horaires": "", "lat": -4.3155346, "lng": 15.2917524, "emoji": "🧸"},
  {"nom": "Game Store (Empire Shopping Center)", "cat": "loisirs", "type": "Jeux vidéo", "adresse": "Empire Shopping Center (1er étage), Av. de la Libération, en face de Swiss Mart", "tel": "+243 821 256 001", "horaires": "7j/7 24h", "lat": -4.3162347, "lng": 15.2921319, "emoji": "🎮"},
  {"nom": "Mausolée Laurent-Désiré Kabila", "cat": "loisirs", "type": "Monument / site", "adresse": "Gombe (près du Palais de la Nation)", "tel": "", "horaires": "", "lat": -4.3038863, "lng": 15.2802702, "emoji": "🏛️"},
  {"nom": "Monument de l'Unité nationale", "cat": "loisirs", "type": "Monument / site", "adresse": "Place Royale (Plus Code M7MM+X64)", "tel": "", "horaires": "Accès libre", "lat": -4.315104, "lng": 15.2830664, "emoji": "🏛️"},
  {"nom": "Place de la Gare Centrale", "cat": "loisirs", "type": "Monument / site", "adresse": "2, Av. Isiro", "tel": "", "horaires": "Accès libre", "lat": -4.301578, "lng": 15.3164745, "emoji": "🏛️"},
  {"nom": "Café Muzik", "cat": "loisirs", "type": "Musique live", "adresse": "Gombe (Plus Code M7VW+99R)", "tel": "+243 817 000 045", "horaires": "7j/7 11h00–23h00", "lat": -4.3065105, "lng": 15.2958962, "emoji": "🎵"},
  {"nom": "Maisha Life", "cat": "loisirs", "type": "Musique live", "adresse": "Gombe (Plus Code M8M5+636)", "tel": "+243 837 003 370", "horaires": "7j/7 8h30–0h00", "lat": -4.3169581, "lng": 15.3076547, "emoji": "🎵"},
  {"nom": "Village Chez Ntemba", "cat": "loisirs", "type": "Musique live", "adresse": "Av. Du Port", "tel": "+243 824 414 042", "horaires": "7j/7 11h30–20h45", "lat": -4.3016486, "lng": 15.3085789, "emoji": "🎵"},
  {"nom": "Jardin botanique de Kinshasa", "cat": "loisirs", "type": "Parc / nature", "adresse": "Av. Kasa-Vubu (Plus Code M8R5+3QG)", "tel": "", "horaires": "7j/7 8h30–17h30", "lat": -4.3098108, "lng": 15.3094598, "emoji": "🌳"},
  {"nom": "Jardin zoologique de Kinshasa", "cat": "loisirs", "type": "Parc / nature", "adresse": "1, Av. Kasa-Vubu", "tel": "", "horaires": "7j/7 7h00–18h00", "lat": -4.3107949, "lng": 15.3068988, "emoji": "🌳"},
  {"nom": "Triangle de la Justice", "cat": "loisirs", "type": "Parc / nature", "adresse": "3, Av. de la Justice", "tel": "", "horaires": "", "lat": -4.305234, "lng": 15.2941462, "emoji": "🌳"},
  {"nom": "Grande Roue de Kinshasa", "cat": "loisirs", "type": "Parc d'attractions", "adresse": "Place de la Gare Centrale, 2 Av. Isiro", "tel": "+243 854 163 963", "horaires": "", "lat": -4.3013655, "lng": 15.3172118, "emoji": "🎡"},
  {"nom": "Centre d'accueil Caritas-Congo (salles de conférence)", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "26, Av. Basoko", "tel": "+243 815 261 783", "horaires": "7j/7 24h", "lat": -4.3088609, "lng": 15.324328, "emoji": "🎉"},
  {"nom": "Kemesha", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "44, Av. de la Justice", "tel": "", "horaires": "", "lat": -4.3074372, "lng": 15.2917162, "emoji": "🎉"},
  {"nom": "L'Adonic Center", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "5, Av. Caisse d'Épargne", "tel": "+243 820 146 250", "horaires": "Lun–Mer 7h30–23h00 ; Jeu–Dim 7h30–2h00", "lat": -4.306519, "lng": 15.2891892, "emoji": "🎉"},
  {"nom": "Le Boulevard – Salle de fêtes et conférences", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "Croisement Bd du 30 Juin / Av. Wangata (ex-Shell)", "tel": "+243 895 540 284", "horaires": "Lun–Ven 10h00–17h00 ; Sam–Dim 9h00–17h00", "lat": -4.3057248, "lng": 15.3031984, "emoji": "🎉"},
  {"nom": "Le Chapiteau", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "30, Av. de la Justice", "tel": "+243 815 424 740", "horaires": "", "lat": -4.3073659, "lng": 15.2919091, "emoji": "🎉"},
  {"nom": "Le Rubis – Centre événementiel", "cat": "loisirs", "type": "Salle de fêtes / événements", "adresse": "2, Av. Père Boka", "tel": "+243 840 825 377", "horaires": "7j/7 7h00–22h00", "lat": -4.3087885, "lng": 15.2838499, "emoji": "🎉"},
  {"nom": "Académie des Beaux-Arts", "cat": "formation", "type": "Arts", "adresse": "Av. Pierre Mulele (ex-24 Novembre)", "tel": "+243 999 016 166", "horaires": "Lun–Sam 7h30–17h30 ; Dim fermé", "lat": -4.3213218, "lng": 15.2933625, "emoji": "🎨", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Institut des Beaux-Arts", "cat": "formation", "type": "Arts", "adresse": "Av. de la Libération (Plus Code M7JV+62G)", "tel": "", "horaires": "", "lat": -4.3194438, "lng": 15.2925834, "emoji": "🎨", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Driving School de la Gombe", "cat": "formation", "type": "Auto-école", "adresse": "Av. Bandundu (Plus Code M8X4+73F)", "tel": "+243 810 000 001", "horaires": "", "lat": -4.3018141, "lng": 15.3051798, "emoji": "🚗"},
  {"nom": "Driving School La Brèche", "cat": "formation", "type": "Auto-école", "adresse": "124, Bd du 30 Juin", "tel": "", "horaires": "", "lat": -4.3031501, "lng": 15.3107832, "emoji": "🚗"},
  {"nom": "Bibliothèque Nationale du Congo", "cat": "formation", "type": "Bibliothèque", "adresse": "Gombe (Plus Code M7WM+733)", "tel": "+243 900 871 439", "horaires": "", "lat": -4.3043625, "lng": 15.2826719, "emoji": "📚"},
  {"nom": "Fondation Agir (bibliothèque)", "cat": "formation", "type": "Bibliothèque", "adresse": "7468, Av. Colonel Ebeya", "tel": "+243 994 987 980", "horaires": "Lun–Ven 8h30–16h30 ; Sam 8h30–12h30 ; Dim fermé", "lat": -4.3069043, "lng": 15.3046255, "emoji": "📚"},
  {"nom": "Bomoko Space", "cat": "formation", "type": "Coworking / incubateur", "adresse": "Nouvelle Galerie Présidentielle, Bd du 30 Juin", "tel": "+243 898 989 987", "horaires": "Lun–Sam 7h00–22h00 ; Dim fermé", "lat": -4.3026076, "lng": 15.311929, "emoji": "🧑‍💻"},
  {"nom": "Kazi Space", "cat": "formation", "type": "Coworking / incubateur", "adresse": "Gombe (Plus Code M7PM+8QG)", "tel": "+243 827 000 061", "horaires": "7j/7 8h00–18h00", "lat": -4.3141873, "lng": 15.284446, "emoji": "🧑‍💻"},
  {"nom": "Kobo Hub", "cat": "formation", "type": "Coworking / incubateur", "adresse": "Imm. 130 B (5e niveau), Av. Kwango", "tel": "+243 998 965 640", "horaires": "Lun–Ven 8h30–17h00 ; Sam–Dim fermé", "lat": -4.3060445, "lng": 15.3202397, "emoji": "🧑‍💻"},
  {"nom": "Institut Supérieur de Commerce (ISC) Kinshasa", "cat": "ecole", "type": "Enseignement supérieur", "adresse": "17c, Av. du 24 Novembre", "tel": "+243 897 709 331", "horaires": "Lun–Sam 8h00–20h30 ; Dim fermé", "lat": -4.3144704, "lng": 15.2901407, "emoji": "🎓"},
  {"nom": "Institut Supérieur de Statistique et Nouvelles Technologies", "cat": "ecole", "type": "Enseignement supérieur", "adresse": "Av. Goma (Plus Code M7VJ+PQV)", "tel": "+243 816 915 864", "horaires": "", "lat": -4.3056348, "lng": 15.28191, "emoji": "🎓"},
  {"nom": "Leadership Academia University", "cat": "ecole", "type": "Enseignement supérieur", "adresse": "4963, Av. Tombalbaye, Q/ Golf", "tel": "+243 819 914 465", "horaires": "Lun–Jeu 9h00–16h00 ; Ven–Dim fermé", "lat": -4.3101834, "lng": 15.2992063, "emoji": "🎓"},
  {"nom": "UNISIC (ex-IFASIC) – Information et Communication", "cat": "ecole", "type": "Enseignement supérieur", "adresse": "Av. Colonel Ebeya", "tel": "+243 810 692 260", "horaires": "Lun–Ven 8h30–16h00 ; Sam–Dim fermé", "lat": -4.3087219, "lng": 15.2989007, "emoji": "🎓"},
  {"nom": "École Nationale des Finances (ENF)", "cat": "formation", "type": "Finances publiques", "adresse": "32, Av. des Armées", "tel": "+243 820 625 809", "horaires": "Lun–Ven 8h00–18h00 ; Sam 6h00–14h00 ; Dim fermé", "lat": -4.3193917, "lng": 15.2855357, "emoji": "🏛️", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Vatel Kinshasa – École internationale d'hôtellerie", "cat": "formation", "type": "Hôtellerie / tourisme", "adresse": "Le Premier Mall, Av. Lt. Colonel Lukusa", "tel": "+243 829 583 388", "horaires": "Lun–Ven 9h00–18h00 ; Sam–Dim fermé", "lat": -4.304902, "lng": 15.2996635, "emoji": "🏨"},
  {"nom": "Agency Training Coaching Service Business", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "13, Av. Lubefu", "tel": "+243 826 211 170", "horaires": "Lun–Ven 8h30–17h00 ; Sam–Dim fermé", "lat": -4.3188336, "lng": 15.278486, "emoji": "💻", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Center Professional Training in Administration, Business & Computer", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "214, Av. de la Rivière", "tel": "+243 896 972 755", "horaires": "Lun–Sam 8h30–19h00 ; Dim fermé", "lat": -4.3193238, "lng": 15.2816498, "emoji": "💻", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Centre Cecontec Gombe", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Av. des Mandariniers (Plus Code M7PR+PCM)", "tel": "+243 997 884 706", "horaires": "Lun–Sam 7h00–19h00 ; Dim fermé", "lat": -4.3131621, "lng": 15.2910314, "emoji": "💻"},
  {"nom": "Centre de formation (Av. du Syndicat)", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "369, Av. du Syndicat", "tel": "+243 816 265 006", "horaires": "", "lat": -4.3075684, "lng": 15.3231699, "emoji": "💻"},
  {"nom": "Cercap Asbl Training Center", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Gombe (Plus Code M8X5+4PC)", "tel": "+243 974 782 952", "horaires": "Lun–Sam 9h00–17h00 ; Dim fermé", "lat": -4.3021788, "lng": 15.3092602, "emoji": "💻"},
  {"nom": "Digital School RDC", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Imm. 130, Av. Kwango", "tel": "+243 973 757 221", "horaires": "Lun–Ven 9h00–17h00 ; Sam–Dim fermé", "lat": -4.3104496, "lng": 15.2843448, "emoji": "💻"},
  {"nom": "Edumen – Centre de formation professionnelle", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "72b, Av. Uvira", "tel": "+243 847 767 523", "horaires": "", "lat": -4.3090703, "lng": 15.2762077, "emoji": "💻"},
  {"nom": "Empreinte Tech", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "130, Av. Kwango", "tel": "+243 899 453 074", "horaires": "Lun–Sam 7h30–19h00 ; Dim fermé", "lat": -4.3059167, "lng": 15.3202274, "emoji": "💻"},
  {"nom": "Enneade Digitech", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Nouvelles Galeries Présidentielles (23e étage), Bd du 30 Juin", "tel": "+243 977 101 530", "horaires": "", "lat": -4.3023786, "lng": 15.3118036, "emoji": "💻"},
  {"nom": "Heyday Academy", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Bd du 30 Juin / 27 rue Isiro", "tel": "+243 853 030 856", "horaires": "Lun–Sam 9h00–17h00 ; Dim fermé", "lat": -4.3039033, "lng": 15.3072643, "emoji": "💻"},
  {"nom": "I.P.A", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "06, Av. Mpolo Maurice, Q/ Kasa-Vubu", "tel": "+243 846 826 752", "horaires": "Lun–Sam 8h00–19h30 ; Dim fermé", "lat": -4.305183, "lng": 15.3057255, "emoji": "💻"},
  {"nom": "Kadea Academy (code, digital)", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Concession COTEX n°63, Av. Colonel Mondjiba", "tel": "+243 810 927 272", "horaires": "Lun–Ven 8h30–21h30 ; Sam 8h30–17h00 ; Dim fermé", "lat": -4.3213536, "lng": 15.274374, "emoji": "💻", "remarque": "Limite ouest de la Gombe (à vérifier)"},
  {"nom": "Smizone Tech", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Gombe", "tel": "", "horaires": "", "lat": -4.3050846, "lng": 15.3052277, "emoji": "💻"},
  {"nom": "Vocational Training Center Kairos", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "Résidence ex-Kisombe, 195 Av. Colonel Ebeya (1er niveau, local 4)", "tel": "+243 907 303 460", "horaires": "Lun–Ven 9h00–17h00 ; Sam–Dim fermé", "lat": -4.3069917, "lng": 15.3044135, "emoji": "💻"},
  {"nom": "École Informatique des Finances", "cat": "formation", "type": "Informatique / professionnelle", "adresse": "27, Bd Colonel Tshatshi", "tel": "+243 814 047 685", "horaires": "Lun–Ven 8h00–17h15 ; Sam 8h30–12h15 ; Dim fermé", "lat": -4.3049857, "lng": 15.2796611, "emoji": "💻"},
  {"nom": "FONJEPAL", "cat": "formation", "type": "Jeunesse / ONG", "adresse": "immeuble Nouvelle galerie présidentielle 22eme étage local C, Bd du 30 Juin", "tel": "+243 811 786 380", "horaires": "Lun–Mer 8h30–16h00 ; Jeu–Ven 8h30–16h30 ; Sam 9h30–12h00 ; Dim fermé", "lat": -4.3023786, "lng": 15.3118036, "emoji": "🤝"},
  {"nom": "CALI – Congo American Language Institute", "cat": "formation", "type": "Langues", "adresse": "81 bis, Av. Goma", "tel": "+243 810 888 838", "horaires": "Lun–Ven 8h00–20h00 ; Sam–Dim fermé", "lat": -4.3067936, "lng": 15.2837249, "emoji": "🗣️"},
  {"nom": "KLC – Kinshasa Language Consultants", "cat": "formation", "type": "Langues", "adresse": "2, Av. Isiro", "tel": "+243 904 341 872", "horaires": "Lun–Ven 8h00–20h00 ; Sam 9h00–17h00 ; Dim 14h00–17h00", "lat": -4.3013655, "lng": 15.3172118, "emoji": "🗣️"},
  {"nom": "Linguazone", "cat": "formation", "type": "Langues", "adresse": "01031, Bd du 30 Juin", "tel": "+243 980 621 902", "horaires": "Lun–Sam 8h30–18h00 ; Dim fermé", "lat": -4.3041981, "lng": 15.3075122, "emoji": "🗣️"},
  {"nom": "The United Friends' College (UFC)", "cat": "formation", "type": "Langues", "adresse": "24-26, Av. de l'Équateur", "tel": "+243 890 200 000", "horaires": "Lun–Ven 7h00–20h00 ; Sam 8h30–13h00 ; Dim fermé", "lat": -4.3051997, "lng": 15.3093933, "emoji": "🗣️"},
  {"nom": "Goethe-Institut Kinshasa", "cat": "formation", "type": "Langues / culture", "adresse": "33, Av. de la Gombe", "tel": "+243 844 021 457", "horaires": "Lun–Ven 10h00–13h00 ; Sam–Dim fermé", "lat": -4.3187136, "lng": 15.287244, "emoji": "🗣️", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "La Maison du Savoir", "cat": "commerce", "type": "Librairie", "adresse": "Quartier Sofide, 5 Av. Père Boka", "tel": "+243 897 725 555", "horaires": "Lun–Sam 10h00–20h00 ; Dim 12h00–18h00", "lat": -4.3070432, "lng": 15.2863432, "emoji": "📚"},
  {"nom": "Librairie de la Halle", "cat": "commerce", "type": "Librairie", "adresse": "Halle de la Gombe, 33 Av. de la Gombe", "tel": "+243 898 975 868", "horaires": "Lun–Sam 10h00–17h00 ; Dim fermé", "lat": -4.3187136, "lng": 15.287244, "emoji": "📚", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Librairie Paulines (Sœurs Filles de Saint-Paul)", "cat": "commerce", "type": "Librairie", "adresse": "44, Av. du Commerce", "tel": "", "horaires": "Lun–Ven 8h30–16h30 ; Sam 9h00–13h00 ; Dim fermé", "lat": -4.3080928, "lng": 15.3099525, "emoji": "📚"},
  {"nom": "Livres pour les Grands Lacs (Rond-Point Forescom)", "cat": "commerce", "type": "Librairie", "adresse": "Rond-Point Forescom (Plus Code M8X5+CG5)", "tel": "+243 898 638 042", "horaires": "Lun–Ven 8h00–16h00 ; Sam 9h00–14h00 ; Dim fermé", "lat": -4.3014998, "lng": 15.3088474, "emoji": "📚"},
  {"nom": "Livres pour les Grands Lacs (Tombalbaye)", "cat": "commerce", "type": "Librairie", "adresse": "Av. Tombalbaye (Plus Code M8V5+CV4)", "tel": "+243 998 612 146", "horaires": "Lun–Ven 8h00–16h00 ; Sam 9h00–14h00 ; Dim fermé", "lat": -4.306488, "lng": 15.3097181, "emoji": "📚"},
  {"nom": "Institut Régional La Mode en Afrique (IRMA)", "cat": "formation", "type": "Mode / métiers", "adresse": "Port Onatra, Bloc 14", "tel": "+243 844 892 581", "horaires": "Lun–Ven 8h00–17h00 ; Sam 8h00–13h00 ; Dim fermé", "lat": -4.2973672, "lng": 15.3112491, "emoji": "🧵"},
  {"nom": "CRESH", "cat": "formation", "type": "Recherche", "adresse": "33, Av. Comité Urbain", "tel": "+243 897 958 474", "horaires": "Lun–Ven 8h00–16h00 ; Sam 8h00–12h00 ; Dim fermé", "lat": -4.3095347, "lng": 15.2926308, "emoji": "🔬"},
  {"nom": "CRGM (Centre de Recherches Géologiques et Minières)", "cat": "formation", "type": "Recherche", "adresse": "44, Av. de la Démocratie", "tel": "", "horaires": "Lun–Ven 8h00–16h00 ; Sam–Dim fermé", "lat": -4.3116077, "lng": 15.3035216, "emoji": "🔬"},
  {"nom": "Institut Technique Industriel de la Gombe (ITI-Gombe)", "cat": "formation", "type": "Technique / métiers", "adresse": "Av. de la Science (Plus Code M7GR+MH4)", "tel": "", "horaires": "Lun–Sam 7h15–12h45 ; Dim fermé", "lat": -4.3233709, "lng": 15.291449, "emoji": "🛠️", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "CNDCI", "cat": "ecole", "type": "Établissement d'enseignement", "adresse": "63 Av. Colonel Mondjiba", "tel": "+243 825 367 992", "horaires": "Lun–Ven 10h00–18h00 ; Sam fermé ; Dim 10h00–18h00", "lat": -4.321305, "lng": 15.274394, "emoji": "🏫", "remarque": "Limite ouest de la Gombe (à vérifier)"},
  {"nom": "Institut de la Gombe", "cat": "ecole", "type": "Établissement d'enseignement", "adresse": "Gombe (Plus Code M7QG+CFM)", "tel": "", "horaires": "", "lat": -4.3114247, "lng": 15.2761693, "emoji": "🏫"},
  {"nom": "Espérance Football Académie", "cat": "sport", "type": "Académie de football", "adresse": "Av. de la Science (Plus Code M7HR+4R7)", "tel": "+243 830 050 448", "horaires": "", "lat": -4.3222096, "lng": 15.2920595, "emoji": "⚽", "remarque": "Limite sud de la Gombe (à vérifier)"},
  {"nom": "Forever Football Academy", "cat": "sport", "type": "Académie de football", "adresse": "52, Av. du Haut-Congo, Golf", "tel": "+243 977 687 154", "horaires": "", "lat": -4.30716, "lng": 15.3100211, "emoji": "⚽"},
  {"nom": "Congo Travel Service", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "Croisement Bd du 30 Juin / Av. du Plateau", "tel": "+243 815 000 422", "horaires": "Lun–Ven 8h00–17h00 ; Sam 8h30–13h00 ; Dim fermé", "lat": -4.3036823, "lng": 15.3108966, "emoji": "✈️"},
  {"nom": "Destination", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "9, Av. de l'Équateur", "tel": "+243 824 995 690", "horaires": "Lun–Ven 8h00–16h00 ; Sam 8h00–13h00 ; Dim fermé", "lat": -4.3021271, "lng": 15.3104556, "emoji": "✈️"},
  {"nom": "First Travel and Tourism", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "Imm. Interfina, 503 Bd du 30 Juin", "tel": "+243 820 329 594", "horaires": "Lun–Ven 8h30–17h30 ; Sam 8h30–15h00 ; Dim fermé", "lat": -4.3031648, "lng": 15.312029, "emoji": "✈️"},
  {"nom": "Icon Travels", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "Galerie Albert, 20 Av. de la Paix", "tel": "+243 891 388 888", "horaires": "Lun–Sam 8h30–17h30 ; Dim fermé", "lat": -4.3022157, "lng": 15.3122391, "emoji": "✈️"},
  {"nom": "Jeffery Travels", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "60, Bd du 30 Juin", "tel": "+243 818 887 777", "horaires": "Lun–Ven 8h30–17h00 ; Sam 8h30–13h00 ; Dim fermé", "lat": -4.3061493, "lng": 15.298368, "emoji": "✈️"},
  {"nom": "RS Travels", "cat": "voyage", "type": "Agence de voyage / tourisme", "adresse": "Bd du 30 Juin, près d'Ethiopian Airlines", "tel": "+243 975 955 944", "horaires": "", "lat": -4.3057271, "lng": 15.3031836, "emoji": "✈️"},
  {"nom": "Galaxy Martial Arts / Cantagalo Congo (Shark Club)", "cat": "formation", "type": "Arts martiaux", "adresse": "Shark Club, Gombe", "tel": "+243 814 339 614", "horaires": "Lun–Ven 15h00–19h30 ; Sam 11h00–17h00 ; Dim fermé", "lat": -4.3109557, "lng": 15.2763319, "emoji": "🎨"},
  {"nom": "Bahati Art Studio", "cat": "loisirs", "type": "Atelier créatif / art", "adresse": "Av. du Mont des Arts", "tel": "+243 828 106 681", "horaires": "", "lat": -4.3157159, "lng": 15.2946864, "emoji": "🎨"},
  {"nom": "Studio Kay (peinture, poterie, bougies)", "cat": "loisirs", "type": "Atelier créatif / art", "adresse": "7280, Av. Claude Maluma", "tel": "+243 995 877 511", "horaires": "Lun–Mar fermé ; Mer–Ven 10h30–20h30 ; Sam 10h30–20h00 ; Dim 15h30–20h30", "lat": -4.3049635, "lng": 15.3217314, "emoji": "🎨"},
  {"nom": "Cercle Elaïs (piscine 50 m, tennis, basket)", "cat": "sport", "type": "Club sportif / piscine", "adresse": "Près du Bd du 30 Juin (Plus Code M8W3+QPP)", "tel": "", "horaires": "", "lat": -4.3030471, "lng": 15.3043225, "emoji": "🏊", "remarque": "Accès non-membres payant"},
  {"nom": "Hôtel Elaïs – piscine et courts de tennis", "cat": "sport", "type": "Club sportif / piscine", "adresse": "Près du Bd du 30 Juin", "tel": "+243 820 050 068", "horaires": "", "lat": -4.3043133, "lng": 15.3030988, "emoji": "🏊"},
  {"nom": "Congo Tours (croisières sur le fleuve)", "cat": "voyage", "type": "Croisière / tourisme", "adresse": "Av. Wagenia (Plus Code P829+66M)", "tel": "+243 858 352 414", "horaires": "Lun 8h30–17h30 ; Mar–Ven 8h30–17h00 ; Sam 8h30–15h30 ; Dim fermé", "lat": -4.2994037, "lng": 15.3180369, "emoji": "🚢"},
  {"nom": "Koba Création (école de danse)", "cat": "sport", "type": "Danse", "adresse": "33, Av. des Forces Armées", "tel": "+243 811 381 070", "horaires": "Lun–Ven 7h00–21h00 ; Sam 24h ; Dim 7h00–21h00", "lat": -4.3179632, "lng": 15.2863368, "emoji": "💃"},
  {"nom": "The Pilates Society", "cat": "bienetre", "type": "Pilates / bien-être", "adresse": "Imm. Rosemall (2e étage, chez Dynafit), 876 Av. de la Justice", "tel": "+243 907 663 399", "horaires": "Lun–Sam 7h30–19h30 ; Dim fermé", "lat": -4.313347, "lng": 15.283274, "emoji": "🧘"},
  {"nom": "Bellevie Restaurant & Bar (piscine)", "cat": "bienetre", "type": "Piscine / détente", "adresse": "Av. Colonel Ebeya (Plus Code M8W8+353)", "tel": "+243 977 519 408", "horaires": "7j/7 6h30–23h00", "lat": -4.3047539, "lng": 15.3154651, "emoji": "🏊"},
  {"nom": "Chez Wiwi (piscine)", "cat": "bienetre", "type": "Piscine / détente", "adresse": "Gombe", "tel": "", "horaires": "", "lat": -4.3139367, "lng": 15.2767508, "emoji": "🏊"},
  {"nom": "La Piscine @ Meraki Spa", "cat": "bienetre", "type": "Piscine / détente", "adresse": "5, Av. Zongo-Ntolo", "tel": "+243 813 784 696", "horaires": "", "lat": -4.3080765, "lng": 15.2777888, "emoji": "🏊"},
  {"nom": "La Lotus Thai Massage", "cat": "bienetre", "type": "Spa / bien-être", "adresse": "Quartier Golf, Av. de la Mission", "tel": "+243 858 950 000", "horaires": "7j/7 10h30–22h30", "lat": -4.3037964, "lng": 15.2988717, "emoji": "💆"},
  {"nom": "Meraki Spa", "cat": "bienetre", "type": "Spa / bien-être", "adresse": "5, Av. Zongo-Ntolo", "tel": "+243 999 903 333", "horaires": "Lun 9h00–18h00 ; Mar–Sam 9h00–19h00 ; Dim 10h00–18h00", "lat": -4.3080765, "lng": 15.2777888, "emoji": "💆"},
  {"nom": "Royal Spa", "cat": "bienetre", "type": "Spa / bien-être", "adresse": "Gombe (Plus Code M7VQ+QM6)", "tel": "+243 901 404 040", "horaires": "7j/7 10h00–22h00", "lat": -4.3054934, "lng": 15.2890124, "emoji": "💆"},
  {"nom": "Uvira Spa & Beauty Therapy (Memling)", "cat": "bienetre", "type": "Spa / bien-être", "adresse": "Hôtel Memling, local 15, Av. de la Rép. du Tchad", "tel": "+243 826 180 015", "horaires": "Lun 9h30–18h00 ; Mar–Mer 9h30–19h30 ; Jeu–Sam 9h00–20h00 ; Dim 11h00–19h00", "lat": -4.3042939, "lng": 15.3122903, "emoji": "💆"},
  {"nom": "Uvira Spa & Beauty Therapy (Uvira)", "cat": "bienetre", "type": "Spa / bien-être", "adresse": "81, Av. Uvira", "tel": "+243 826 180 015", "horaires": "Lun 9h30–18h00 ; Mar–Mer 9h30–19h30 ; Jeu–Sam 9h00–20h00 ; Dim 11h00–19h00", "lat": -4.3117968, "lng": 15.2743895, "emoji": "💆"},
  {"nom": "Padel – River Tower's", "cat": "sport", "type": "Sport (padel)", "adresse": "River Tower's, 4260 Av. de la Mission", "tel": "", "horaires": "", "lat": -4.3015033, "lng": 15.2989089, "emoji": "🎾"},
  {"nom": "Courts de tennis du Cercle", "cat": "sport", "type": "Sport (tennis)", "adresse": "Av. du Cercle", "tel": "", "horaires": "", "lat": -4.3130799, "lng": 15.2939112, "emoji": "🎾"},
  {"nom": "Fujifilm AmiCongo Studio 121", "cat": "loisirs", "type": "Studio photo / musique", "adresse": "Av. des Aviateurs (Plus Code M8X6+XF2)", "tel": "+243 817 006 569", "horaires": "Lun–Ven 7h00–17h00 ; Sam 8h00–13h00 ; Dim fermé", "lat": -4.3002243, "lng": 15.311136, "emoji": "📸"},
  {"nom": "OpalStudio Kinshasa", "cat": "loisirs", "type": "Studio photo / musique", "adresse": "Av. de l'Équateur, en face de Maison Galaxy", "tel": "+243 996 758 628", "horaires": "Lun–Sam 9h00–17h00 ; Dim fermé", "lat": -4.3023941, "lng": 15.3104522, "emoji": "📸"},
  {"nom": "Photo Guy", "cat": "loisirs", "type": "Studio photo / musique", "adresse": "Imm. du 30 Juin, 10 Bd du 30 Juin", "tel": "+243 999 915 115", "horaires": "Lun–Ven 7h30–15h30 ; Sam 9h00–13h00 ; Dim fermé", "lat": -4.3038231, "lng": 15.3077701, "emoji": "📸"},
  {"nom": "Studio P2R Records", "cat": "loisirs", "type": "Studio photo / musique", "adresse": "Imm. ACP, 44-48 Av. Tombalbaye", "tel": "+243 999 044 340", "horaires": "Lun fermé ; Mar–Sam 12h00–21h00 ; Dim fermé", "lat": -4.3067421, "lng": 15.3096186, "emoji": "📸"},
  {"nom": "Station-service Cobil (Av. du Plateau)", "cat": "station", "type": "Station-service Cobil", "adresse": "8884, Av. du Plateau", "tel": "", "horaires": "", "lat": -4.3049123, "lng": 15.3112195},
  {"nom": "Engen Petrol Pump (Socimat)", "cat": "station", "type": "Station-service Engen", "adresse": "Gombe (M7HF+PPW)", "tel": "", "horaires": "", "lat": -4.3206387, "lng": 15.2743341},
  {"nom": "Engen Station Carburant Tombalbaye", "cat": "station", "type": "Station-service Engen", "adresse": "Av. Tombalbaye (M8V7+RP2)", "tel": "", "horaires": "", "lat": -4.3054816, "lng": 15.3142619},
  {"nom": "Station Engen FS Justice", "cat": "station", "type": "Station-service Engen", "adresse": "3-4, Av. de la Justice", "tel": "", "horaires": "", "lat": -4.305773, "lng": 15.2943875},
  {"nom": "Station Engen FS Nova", "cat": "station", "type": "Station-service Engen", "adresse": "Gombe (M7JV+F7C)", "tel": "", "horaires": "", "lat": -4.318812, "lng": 15.2931334},
  {"nom": "Station Engen Lukusa", "cat": "station", "type": "Station-service Engen", "adresse": "Av. Lt. Colonel Lukusa (M8W4+V4M)", "tel": "", "horaires": "", "lat": -4.3027867, "lng": 15.3053072},
  {"nom": "Station Ariana", "cat": "station", "type": "Station-service", "adresse": "Av. de la Libération (ex-24 Novembre), en diagonale de la Maison Schengen", "tel": "", "horaires": "", "lat": -4.319269, "lng": 15.2934861},
  {"nom": "Station Zigida", "cat": "station", "type": "Station-service", "adresse": "Gombe (M8W6+M6R)", "tel": "", "horaires": "", "lat": -4.3032527, "lng": 15.310528, "remarque": "Position approximative sur la carte."},
  {"nom": "Stations Moulaert", "cat": "station", "type": "Station-service", "adresse": "Rond-point Moulaert, Av. Kasa-Vubu", "tel": "", "horaires": "7j/7 24h", "lat": -4.3032527, "lng": 15.310528, "remarque": "Position approximative sur la carte."},
  {"nom": "By Berton Lavage Auto", "cat": "station", "type": "Lavage auto", "adresse": "Av. de la Mission (M7WX+38Q)", "tel": "", "horaires": "", "lat": -4.3046221, "lng": 15.2982601},
  {"nom": "Car Wash (Engen FS Nova)", "cat": "station", "type": "Lavage auto", "adresse": "Gombe (M7JV+F7C)", "tel": "+243 836 008 423", "horaires": "7j/7 8h00–18h00", "lat": -4.3187973, "lng": 15.2931194},
  {"nom": "Car Wash Express", "cat": "station", "type": "Lavage auto", "adresse": "Gombe (M8W4+34Q)", "tel": "+243 817 218 106", "horaires": "", "lat": -4.3047981, "lng": 15.3053546},
  {"nom": "Digital Auto Garage", "cat": "station", "type": "Lavage auto", "adresse": "Av. des Armées (Haut Commandement)", "tel": "+243 971 061 310", "horaires": "7j/7 24h", "lat": -4.3163355, "lng": 15.2866288},
  {"nom": "Sonahydro Gombe", "cat": "station", "type": "Station-service Sonahydro", "adresse": "Près de la Haute Cour (M7VR+VWQ)", "tel": "", "horaires": "", "lat": -4.3052833, "lng": 15.2923707},
  {"nom": "Station TotalEnergies Ngongo Lutete", "cat": "station", "type": "Station-service TotalEnergies", "adresse": "652, Av. Lt. Colonel Lukusa", "tel": "+243 857 111 111", "horaires": "7j/7 5h00–20h00", "lat": -4.3030966, "lng": 15.3036171},
  {"nom": "Station TotalEnergies École (Mandela)", "cat": "station", "type": "Station-service TotalEnergies", "adresse": "Bd du 30 Juin / Av. de la Libération", "tel": "+243 857 111 111", "horaires": "7j/7 24h", "lat": -4.3118239, "lng": 15.2889079},
  {"nom": "Access Bank (Av. du 24 Novembre)", "cat": "banque", "type": "Banque", "adresse": "Av. du 24 Novembre (M7MR+PG8)", "tel": "", "horaires": "", "lat": -4.3157021, "lng": 15.291337},
  {"nom": "Access Bank (Av. du Livre)", "cat": "banque", "type": "Banque", "adresse": "63, Av. du Livre", "tel": "", "horaires": "", "lat": -4.3073228, "lng": 15.3015213},
  {"nom": "Access Bank RDC – Siège", "cat": "banque", "type": "Banque", "adresse": "158, Av. de la Démocratie (ex-Huilerie)", "tel": "+243 815 599 450", "horaires": "Lun–Ven 8h00–16h00; Sam 9h00–12h00; Dim fermé", "lat": -4.3121957, "lng": 15.3024432},
  {"nom": "Advans Congo (microfinance)", "cat": "banque", "type": "Microfinance", "adresse": "407, Av. Roi Baudouin", "tel": "+243 815 567 702", "horaires": "Lun–Ven 8h00–16h00; Sam 8h00–12h00; Dim fermé", "lat": -4.304866, "lng": 15.2869818},
  {"nom": "Afrique Bank (Av. Ngongo Lutete)", "cat": "banque", "type": "Banque", "adresse": "47, Av. Ngongo Lutete", "tel": "+243 996 016 000", "horaires": "", "lat": -4.302615, "lng": 15.3016645},
  {"nom": "Bank of Africa RDC (BOA-RDC)", "cat": "banque", "type": "Banque", "adresse": "22, Av. des Aviateurs", "tel": "+243 846 000 506", "horaires": "Lun–Ven 8h00–16h00; Sam 8h00–12h45; Dim fermé", "lat": -4.3001112, "lng": 15.3094318},
  {"nom": "Banque Centrale du Congo (BCC) – Siège", "cat": "banque", "type": "Banque", "adresse": "563, Bd Colonel Tshatshi", "tel": "+243 829 902 143", "horaires": "Lun–Ven 8h00–16h00; Sam–Dim fermé", "lat": -4.3051069, "lng": 15.282018, "remarque": "Pas de service aux particuliers."},
  {"nom": "BGFIBank RDC (avec ATM)", "cat": "banque", "type": "Banque", "adresse": "Bd du 30 Juin (M7PM+PVC)", "tel": "", "horaires": "Lun–Ven 8h30–16h30; Sam–Dim fermé", "lat": -4.3131801, "lng": 15.2846405},
  {"nom": "Citibank (Citigroup)", "cat": "banque", "type": "Banque", "adresse": "Av. Ngongo Lutete (M8W2+JX9)", "tel": "", "horaires": "", "lat": -4.3034602, "lng": 15.3024895},
  {"nom": "Ecobank Kinshasa (avec ATM)", "cat": "banque", "type": "Banque", "adresse": "Gombe (M7JV+F6P)", "tel": "+243 996 016 008", "horaires": "7j/7 24h", "lat": -4.3187848, "lng": 15.293071},
  {"nom": "Banque Commerciale du Congo (Equity BCDC)", "cat": "banque", "type": "Banque", "adresse": "4856, Bd du 30 Juin", "tel": "+243 999 919 762", "horaires": "Lun–Ven 8h30–16h00; Sam 8h30–12h30; Dim fermé", "lat": -4.3037158, "lng": 15.3105399},
  {"nom": "BCDC Agence Gombe Royal", "cat": "banque", "type": "Banque", "adresse": "Gombe (M7PJ+3PP)", "tel": "+243 817 113 456", "horaires": "", "lat": -4.3147794, "lng": 15.2818349},
  {"nom": "Equity BCDC Fleuve Congo", "cat": "banque", "type": "Banque", "adresse": "119, Bd Colonel Tshatshi", "tel": "+243 818 302 700", "horaires": "Lun–Ven 8h30–16h00; Sam–Dim 11h00–19h00", "lat": -4.308079, "lng": 15.275577},
  {"nom": "Equity BCDC Lukusa", "cat": "banque", "type": "Banque", "adresse": "Av. de la TSF / Av. Lt. Colonel Lukusa", "tel": "+243 818 302 700", "horaires": "Lun–Ven 8h30–16h00; Sam 8h00–12h00; Dim fermé", "lat": -4.304931, "lng": 15.299645},
  {"nom": "Equity BCDC Memling", "cat": "banque", "type": "Banque", "adresse": "Av. de la République du Tchad", "tel": "+243 818 302 700", "horaires": "Lun–Ven 8h30–16h00; Sam 8h00–12h00; Dim fermé", "lat": -4.304487, "lng": 15.3120513},
  {"nom": "Equity BCDC Royal", "cat": "banque", "type": "Banque", "adresse": "Place Le Royal, 136 Bd du 30 Juin", "tel": "+243 818 302 700", "horaires": "Lun–Ven 8h30–16h00; Sam 8h00–12h00; Dim fermé", "lat": -4.314806, "lng": 15.281883},
  {"nom": "Equity BCDC – Siège", "cat": "banque", "type": "Banque", "adresse": "15, Bd du 30 Juin", "tel": "+243 996 018 000", "horaires": "Lun–Ven 9h00–17h00; Sam 9h00–12h00; Dim fermé", "lat": -4.3037502, "lng": 15.3105443},
  {"nom": "FINCA Congo SA (Tombalbaye)", "cat": "banque", "type": "Banque", "adresse": "1286, Av. Tombalbaye", "tel": "", "horaires": "", "lat": -4.3042197, "lng": 15.3181882},
  {"nom": "FINCA RDC (près de l'Assemblée provinciale)", "cat": "banque", "type": "Banque", "adresse": "Gombe (M8V4+8JP)", "tel": "", "horaires": "Lun–Ven 8h30–16h00; Sam 9h00–12h00; Dim fermé", "lat": -4.3066528, "lng": 15.3065814},
  {"nom": "FBNBank (Av. de l'Équateur)", "cat": "banque", "type": "Banque", "adresse": "191, Av. de l'Équateur", "tel": "+243 815 558 858", "horaires": "", "lat": -4.2996332, "lng": 15.3115774},
  {"nom": "FBNBank Agence Socimat", "cat": "banque", "type": "Banque", "adresse": "Av. Malemba Mukulu (M7GH+VCG)", "tel": "", "horaires": "Lun–Ven 8h00–15h00; Sam–Dim fermé", "lat": -4.3228226, "lng": 15.278577},
  {"nom": "FirstBank DRC SA – Siège", "cat": "banque", "type": "Banque", "adresse": "Gombe (près du Bd du 30 Juin)", "tel": "+243 815 558 858", "horaires": "Lun–Ven 8h00–15h00; Sam 8h00–12h00; Dim fermé", "lat": -4.2998496, "lng": 15.3112031},
  {"nom": "FirstBank DRC – Agence Boulevard 30 Juin", "cat": "banque", "type": "Banque", "adresse": "Bd du 30 Juin", "tel": "+243 815 558 858", "horaires": "Lun–Ven 8h00–15h00; Sam–Dim fermé", "lat": -4.3032154, "lng": 15.3105518},
  {"nom": "IFOD SA", "cat": "banque", "type": "Microfinance", "adresse": "Gombe (M8R2+9P6)", "tel": "+243 811 538 866", "horaires": "Lun–Ven 8h00–15h30; Sam 8h00–12h30; Dim fermé", "lat": -4.3090971, "lng": 15.3017558},
  {"nom": "LOLC Finance RDC", "cat": "banque", "type": "Microfinance", "adresse": "18, Av. Tabu Ley", "tel": "+243 832 222 546", "horaires": "Lun–Ven 8h30–17h00; Sam 9h00–13h00; Dim fermé", "lat": -4.3049338, "lng": 15.3152},
  {"nom": "Mecreco / Coocec", "cat": "banque", "type": "Microfinance", "adresse": "37, Av. Mpolo", "tel": "+243 976 002 007", "horaires": "Lun–Sam 8h30–19h00; Dim fermé", "lat": -4.3054864, "lng": 15.306542},
  {"nom": "Microfinance Bisou Bisou SA", "cat": "banque", "type": "Microfinance", "adresse": "218, Av. Colonel Ebeya", "tel": "+243 831 270 636", "horaires": "Lun–Ven 8h00–16h30; Sam 8h00–13h00; Dim fermé", "lat": -4.304088, "lng": 15.3140789},
  {"nom": "Rawbank (La Couronne)", "cat": "banque", "type": "Banque", "adresse": "Av. de la Démocratie (M8W4+H43)", "tel": "", "horaires": "Lun–Ven 8h00–15h30; Sam 9h00–12h00; Dim fermé", "lat": -4.3036128, "lng": 15.3052922},
  {"nom": "Rawbank Agence Hôtel de Ville", "cat": "banque", "type": "Banque", "adresse": "Av. du Marché (M8V5+WH3)", "tel": "", "horaires": "Lun–Ven 8h30–15h30; Sam 9h00–12h00; Dim fermé", "lat": -4.3052256, "lng": 15.3089359},
  {"nom": "Rawbank Agence Utex", "cat": "banque", "type": "Banque", "adresse": "40693, Av. Colonel Mondjiba", "tel": "", "horaires": "Lun–Mer 8h30–15h30; Jeu 8h30–16h30; Ven 8h30–16h00; Sam 9h00–15h00", "lat": -4.3237152, "lng": 15.269958},
  {"nom": "Rawbank – Siège", "cat": "banque", "type": "Banque", "adresse": "12/66, croisement Av. Katanga / Av. Lt. Colonel Lukusa", "tel": "+243 996 016 300", "horaires": "Lun–Ven 8h30–15h30; Sam 9h00–12h00; Dim fermé", "lat": -4.3046822, "lng": 15.2949509},
  {"nom": "Sofibanque", "cat": "banque", "type": "Banque", "adresse": "4258, Av. Kabasele Tshamala", "tel": "+243 817 300 200", "horaires": "Lun–Ven 8h30–15h30; Sam–Dim fermé", "lat": -4.3066379, "lng": 15.3242866},
  {"nom": "Solidaire Banque SA (Av. du Marché)", "cat": "banque", "type": "Banque", "adresse": "04, Av. du Marché", "tel": "+243 817 070 701", "horaires": "Lun–Ven 8h00–17h00; Sam–Dim fermé", "lat": -4.304996, "lng": 15.3083046},
  {"nom": "Solidaire Banque SA (Memling)", "cat": "banque", "type": "Banque", "adresse": "Av. de la République du Tchad", "tel": "+243 817 070 701", "horaires": "Lun–Ven 8h30–16h30; Sam–Dim fermé", "lat": -4.304339, "lng": 15.3122446},
  {"nom": "Solidaire Groupe (M8W7)", "cat": "banque", "type": "Banque", "adresse": "Gombe (M8W7+V57)", "tel": "+243 999 410 410", "horaires": "Lun–Sam 8h00–16h00; Dim fermé", "lat": -4.3028416, "lng": 15.3129343},
  {"nom": "Standard Bank (Stanbic) RDC", "cat": "banque", "type": "Banque", "adresse": "14, Av. de la Mongala", "tel": "+243 996 060 060", "horaires": "", "lat": -4.3031721, "lng": 15.3063057},
  {"nom": "TMB – Trust Merchant Bank (Place du Marché)", "cat": "banque", "type": "Banque", "adresse": "1, Place du Marché (derrière l'Hôtel de Ville)", "tel": "+243 817 562 771", "horaires": "Lun–Ven 8h00–16h00; Sam 7h30–12h00; Dim fermé", "lat": -4.3067883, "lng": 15.3096836},
  {"nom": "United Bank for Africa (UBA) RDC", "cat": "banque", "type": "Banque", "adresse": "Av. du 24 Novembre (M7PQ+VRR)", "tel": "+243 996 020 064", "horaires": "Lun–Ven 8h00–16h00; Dim fermé", "lat": -4.3127525, "lng": 15.2895158},
  {"nom": "ATM Ecobank (M8W7)", "cat": "atm", "type": "Distributeur Ecobank", "adresse": "Gombe (M8W7+V55)", "tel": "", "horaires": "", "lat": -4.3028652, "lng": 15.3129867},
  {"nom": "ATM Equity Banque (M8V2)", "cat": "atm", "type": "Distributeur Equity BCDC", "adresse": "Gombe (M8V2+GJX)", "tel": "", "horaires": "", "lat": -4.3061333, "lng": 15.3016081},
  {"nom": "FINCA Express (ATM)", "cat": "atm", "type": "Distributeur FINCA", "adresse": "Av. Bakongo (M8P8+2RM)", "tel": "", "horaires": "", "lat": -4.3149101, "lng": 15.3170614},
  {"nom": "ATM ProCredit Bank (M8X7)", "cat": "atm", "type": "Distributeur ProCredit", "adresse": "Gombe (M8X7+CVX)", "tel": "", "horaires": "", "lat": -4.3013785, "lng": 15.3147309},
  {"nom": "ATM ProCredit Bank – Av. de la Paix", "cat": "atm", "type": "Distributeur ProCredit", "adresse": "300, Av. de la Paix", "tel": "", "horaires": "7j/7 24h", "lat": -4.301337, "lng": 15.309469},
  {"nom": "ATM Rawbank (M8HH)", "cat": "atm", "type": "Distributeur Rawbank", "adresse": "Gombe (M8HH+QP8)", "tel": "", "horaires": "7j/7 24h", "lat": -4.320579, "lng": 15.3293187},
  {"nom": "ATM Rawbank – Av. du Commerce", "cat": "atm", "type": "Distributeur Rawbank", "adresse": "Av. du Commerce (M8V8+735)", "tel": "", "horaires": "7j/7 24h", "lat": -4.3068324, "lng": 15.3151743},
  {"nom": "ATM Rawbank – Galerie Albert", "cat": "atm", "type": "Distributeur Rawbank", "adresse": "Galerie Albert (2e niveau), Bd du 30 Juin", "tel": "", "horaires": "Lun–Ven 9h45–15h45; Sam–Dim 10h30–12h00", "lat": -4.3030179, "lng": 15.312352},
  {"nom": "ATM Rawbank – Père Boka", "cat": "atm", "type": "Distributeur Rawbank", "adresse": "7, Av. Père Boka", "tel": "", "horaires": "", "lat": -4.3068511, "lng": 15.2863949},
  {"nom": "Winning Exchange Service", "cat": "transfert", "type": "Bureau de change", "adresse": "37, Av. Mpolo", "tel": "+243 896 690 709", "horaires": "", "lat": -4.3054864, "lng": 15.306542},
  {"nom": "Dadanada (transfert d'argent)", "cat": "transfert", "type": "Transfert d'argent", "adresse": "Bd du 30 Juin, en face de la Grande Poste", "tel": "+243 976 645 070", "horaires": "Lun–Ven 8h00–16h00; Sam 8h00–13h00; Dim fermé", "lat": -4.3038418, "lng": 15.3076478},
  {"nom": "Airtel DRC – Siège", "cat": "transfert", "type": "Mobile money – Airtel Money", "adresse": "Gombe (M8X6+C53)", "tel": "+243 996 000 121", "horaires": "", "lat": -4.301481, "lng": 15.310414},
  {"nom": "Airtel Express (30 Juin)", "cat": "transfert", "type": "Mobile money – Airtel Money", "adresse": "Bd du 30 Juin (M8X7+46G)", "tel": "+243 844 477 309", "horaires": "", "lat": -4.3021982, "lng": 15.313082},
  {"nom": "Shop Airtel Centenaire", "cat": "transfert", "type": "Mobile money – Airtel Money", "adresse": "Galerie du Centenaire, 10 Bd du 30 Juin", "tel": "", "horaires": "Lun–Ven 8h30–18h30; Sam 8h30–16h30; Dim 9h00–15h30", "lat": -4.3022189, "lng": 15.3130699},
  {"nom": "Shop Airtel Memling", "cat": "transfert", "type": "Mobile money – Airtel Money", "adresse": "Hôtel Memling, 5 Av. du Tchad", "tel": "+243 811 502 660", "horaires": "Lun–Ven 8h30–18h30; Sam 8h30–16h30; Dim 9h00–15h30", "lat": -4.3040652, "lng": 15.3119367},
  {"nom": "Vodacom Square", "cat": "transfert", "type": "Mobile money – M-Pesa", "adresse": "3387-91, Av. Lukusa (réf. ex-Renault Zaïre)", "tel": "+243 816 710 606", "horaires": "Lun–Ven 8h00–17h00; Sam 8h00–12h00; Dim fermé", "lat": -4.3018533, "lng": 15.3066286},
  {"nom": "Vodacom – Bd du 30 Juin (130)", "cat": "transfert", "type": "Mobile money – M-Pesa", "adresse": "130, Bd du 30 Juin", "tel": "", "horaires": "", "lat": -4.3056703, "lng": 15.3000663},
  {"nom": "Vodacom – Hôtel Fleuve Congo", "cat": "transfert", "type": "Mobile money – M-Pesa", "adresse": "119, Bd Colonel Tshatshi (dans l'Hôtel Fleuve Congo)", "tel": "", "horaires": "Lun–Ven 8h00–17h00; Sam 8h00–12h00; Dim fermé", "lat": -4.3132, "lng": 15.2699},
  {"nom": "Vodacom – Rond-point Socimat", "cat": "transfert", "type": "Mobile money – M-Pesa", "adresse": "3961, Bd du 30 Juin (en face de Tractafric)", "tel": "+243 822 842 409", "horaires": "Lun–Ven 8h00–17h00; Sam 8h00–12h00; Dim fermé", "lat": -4.3207449, "lng": 15.2761645},
  {"nom": "Orange – Av. de la Paix", "cat": "transfert", "type": "Mobile money – Orange Money", "adresse": "300, Av. de la Paix", "tel": "", "horaires": "Lun–Ven 8h30–16h00; Sam 10h30–14h30; Dim fermé", "lat": -4.3014798, "lng": 15.3092442, "remarque": "Avis récent : boutique peut-être fermée."},
  {"nom": "MoneyGram (Bd du 30 Juin)", "cat": "transfert", "type": "MoneyGram", "adresse": "397, Bd du 30 Juin", "tel": "+243 996 016 300", "horaires": "Lun–Ven 8h00–17h30; Sam 9h00–15h30; Dim fermé", "lat": -4.311934, "lng": 15.2867671},
  {"nom": "MoneyGram (dans Rawbank, Av. de la Démocratie)", "cat": "transfert", "type": "MoneyGram", "adresse": "21, Av. de la Démocratie", "tel": "+243 996 016 300", "horaires": "Lun–Ven 8h30–16h30; Sam 8h30–13h30; Dim fermé", "lat": -4.3036352, "lng": 15.3052853},
  {"nom": "Soficom Transfert – Siège", "cat": "transfert", "type": "Transfert d'argent", "adresse": "Av. des Sénégalais", "tel": "+243 998 724 444", "horaires": "Lun–Ven 8h00–16h00; Sam 8h00–14h00; Dim fermé", "lat": -4.3024655, "lng": 15.3178277},
  {"nom": "Western Union – Av. de la Démocratie", "cat": "transfert", "type": "Western Union", "adresse": "158, Av. de la Démocratie", "tel": "+243 812 222 111", "horaires": "", "lat": -4.3121957, "lng": 15.3024432},
  {"nom": "Western Union – Av. de la Justice (30)", "cat": "transfert", "type": "Western Union", "adresse": "30, Av. de la Justice", "tel": "+243 827 174 394", "horaires": "", "lat": -4.3073694, "lng": 15.2919775},
  {"nom": "Western Union – Av. du Plateau", "cat": "transfert", "type": "Western Union", "adresse": "280, Av. du Plateau", "tel": "+243 827 174 394", "horaires": "", "lat": -4.3050776, "lng": 15.3110122},
  {"nom": "Western Union – Av. Tombalbaye", "cat": "transfert", "type": "Western Union", "adresse": "1165/1175, Av. Tombalbaye", "tel": "+243 817 004 000", "horaires": "", "lat": -4.3071197, "lng": 15.3085359},
  {"nom": "Western Union – Kin Plaza", "cat": "transfert", "type": "Western Union", "adresse": "Kin Plaza n°35, Av. de la Justice", "tel": "+243 817 004 000", "horaires": "7j/7 7h00–20h30", "lat": -4.3070822, "lng": 15.2926951},
  {"nom": "Engen DRC SA – Siège", "cat": "autre", "type": "Siège / bureau", "adresse": "14/16, Av. du Port", "tel": "+243 815 565 999", "horaires": "Lun–Dim 8h00–17h00", "lat": -4.3006998, "lng": 15.3090372, "remarque": "Bureau de la société pétrolière, pas une station."},
  {"nom": "FPM – Fonds pour l'inclusion financière", "cat": "banque", "type": "Institution financière", "adresse": "2, Av. Kasa-Vubu", "tel": "+243 992 006 139", "horaires": "Lun–Ven 8h00–17h00; Sam–Dim fermé", "lat": -4.3047017, "lng": 15.3066812, "remarque": "Bureau (pas de guichet)."}
];

const CATS = { restaurant: "Restaurants et cafés", bar: "Bars et lounges", pharmacie: "Pharmacies", commerce: "Commerces", sport: "Terrains et sport", culte: "Lieux de culte", hotel: "Hôtels", sante: "Santé", loisirs: "Loisirs et sorties", formation: "Formation et cours", bienetre: "Bien-être et spa", voyage: "Voyages et tourisme", banque: "Banques", atm: "Distributeurs (ATM)", station: "Stations-service", transfert: "Transfert d'argent", ecole: "Écoles", autre: "Autres" };
const CAT_COURT = { restaurant: "Restos", bar: "Bars", pharmacie: "Pharmacies", commerce: "Commerces", sport: "Sport", culte: "Culte", hotel: "Hôtels", sante: "Santé", loisirs: "Loisirs", formation: "Formation", bienetre: "Bien-être", voyage: "Voyages", banque: "Banques", atm: "ATM", station: "Stations", transfert: "Transferts", ecole: "Écoles", autre: "Autres" };
const CAT_LABEL = { restaurant: "Restaurant", bar: "Bar", pharmacie: "Pharmacie", commerce: "Commerce", sport: "Sport", culte: "Lieu de culte", hotel: "Hôtel", sante: "Santé", loisirs: "Loisirs", formation: "Formation", bienetre: "Bien-être", voyage: "Voyage", banque: "Banque", atm: "Distributeur (ATM)", station: "Station-service", transfert: "Transfert d'argent", ecole: "École", autre: "Autre lieu" };
const COULEUR = { restaurant: "#e08a00", bar: "#8e44ad", pharmacie: "#1b998b", commerce: "#2f6fed", sport: "#2e9b4f", culte: "#7a5c3e", hotel: "#d6336c", sante: "#e03c31", loisirs: "#c026d3", formation: "#4f46e5", bienetre: "#0891b2", voyage: "#475569", banque: "#374151", atm: "#0f766e", station: "#ea580c", transfert: "#ca8a04", ecole: "#3b82f6", autre: "#6b7a90" };
const EMOJI = { restaurant: "🍽️", bar: "🍸", pharmacie: "💊", commerce: "🛒", sport: "⚽", culte: "⛪", hotel: "🏨", sante: "🏥", loisirs: "🎭", formation: "🎓", bienetre: "💆", voyage: "✈️", banque: "🏦", atm: "🏧", station: "⛽", transfert: "💸", ecole: "🏫", autre: "📍" };
const GOMBE = [[-4.328, 15.268], [-4.293, 15.322]];
const ZONE_LARGE = { s: -4.345, n: -4.28, o: 15.25, e: 15.34 };
// Mettre true pour afficher publiquement les commerces inscrits et validés (après avoir supprimé les comptes de test dans l'admin).
const AFFICHAGE_PUBLIC = false;
const COMMUNES_OUVERTES = ["Gombe", "Ngaliema", "Kintambo", "Limete"];
// Cadrage approximatif de chaque commune sur la carte (à affiner avec les données de chaque commune).
const BORNES_COMMUNE = { Gombe: GOMBE, Ngaliema: [[-4.405, 15.20], [-4.32, 15.285]], Kintambo: [[-4.335, 15.255], [-4.31, 15.29]], Limete: [[-4.385, 15.31], [-4.335, 15.38]] };
const communeDe = l => l.commune || "Gombe";   // les lieux déjà référencés sont tous à Gombe
const ORDRE = { verifie: 0, inscrit: 1, reference: 2, osm: 3 };
const ordre = l => l.haut ? -1 : ORDRE[l.source];

function catOSM(t) {
  const a = t.amenity, s = t.shop, to = t.tourism;
  if (["restaurant", "cafe", "fast_food"].includes(a)) return "restaurant";
  if (["bar", "pub", "nightclub"].includes(a)) return "bar";
  if (a === "pharmacy") return "pharmacie";
  if (["hospital", "clinic", "doctors"].includes(a)) return "sante";
  if (a === "bank") return "banque";
  if (["pitch", "sports_centre", "stadium"].includes(t.leisure)) return "sport";
  if (["school", "university"].includes(a)) return "ecole";
  if (a === "place_of_worship") return "culte";
  if (["hotel", "guest_house"].includes(to)) return "hotel";
  if (s || a === "marketplace") return "commerce";
  return "autre";
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, ""); }
function normS(s) { return norm(s).replace(/y/g, "i"); }
const developper = s => String(s).replace(/\bbd\.?(?=\s|$)/gi, "boulevard").replace(/\bav\.?(?=\s|$)/gi, "avenue");
function correspond(nom, requete) {
  const n = normS(developper(nom));
  return String(developper(requete)).split(/\s+/).map(normS).filter(Boolean).every(t => n.includes(t));
}
const aPosition = l => typeof l.lat === "number" && typeof l.lng === "number";
const emojiDe = l => l.emoji || (l.cat === "culte" && l.religion === "muslim" ? "🕌" : (EMOJI[l.cat] || "📍"));
const texteRecherche = l => [l.nom, l.adresse, l.type, CATS[l.cat], l.commune].filter(Boolean).join(" ");
const adresseAff = l => l.adresse + (l.commune && norm(l.adresse).indexOf(norm(l.commune)) < 0 ? ", " + l.commune : "");
const premierNum = t => String(t).split(/[;,\/]|\bou\b/)[0];
const telHref = t => "tel:" + premierNum(t).replace(/[^\d+]/g, "");
const waHref = t => { let d = premierNum(t).replace(/\D/g, ""); if (d.length === 9) d = "243" + d; else if (d.charAt(0) === "0") d = "243" + d.slice(1); return "https://wa.me/" + d; };
const estMobile = t => /^(\+?243|0)?[89]\d{8}$/.test(premierNum(t).replace(/[^\d+]/g, ""));
const MAIL = "contact@nexviardc.com";
const signalHref = l => "mailto:" + MAIL + "?subject=" + encodeURIComponent("Nexvia RDC – Signalement : " + l.nom) + "&body=" + encodeURIComponent("Bonjour l'équipe Nexvia RDC,\n\nJe signale un problème sur cette fiche :\nLieu : " + l.nom + "\nAdresse : " + (l.adresse || "") + "\n\nCe qui n'est pas correct :\n- Téléphone :\n- Horaires :\n- Position sur la carte :\n- Lieu fermé ou déplacé :\n- Autre :\n\nMerci !\n");
// ---- Ouvert maintenant (heure de Kinshasa, UTC+1) ----
const J7 = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
function ouvertMaintenant(h) {
  if (!h) return null;
  const s = String(h).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/24\s*h\s*\/\s*24|24\s*\/\s*7/.test(s)) return true;
  const k = new Date(Date.now() + 3600000), d = (k.getUTCDay() + 6) % 7, t = k.getUTCHours() * 60 + k.getUTCMinutes(), veille = (d + 6) % 7;
  let ouvert = false, couvert = false;
  let prec = null;
  s.replace(/,/g, ";").split(";").forEach(seg => {
    let jours = [], sansJour = false;
    const rg = seg.match(/\b(lun|mar|mer|jeu|ven|sam|dim)\w*\s*[-–]\s*(lun|mar|mer|jeu|ven|sam|dim)/);
    if (/tous les jours|7\s*j\s*\/\s*7/.test(seg)) jours = [0, 1, 2, 3, 4, 5, 6];
    else if (rg) { let a = J7.indexOf(rg[1]), b = J7.indexOf(rg[2]); for (let i = a; ; i = (i + 1) % 7) { jours.push(i); if (i === b) break; } }
    else { (seg.match(/\b(lun|mar|mer|jeu|ven|sam|dim)/g) || []).forEach(x => jours.push(J7.indexOf(x))); }
    if (!jours.length) jours = prec && !/tous les jours|7\s*j\s*\/\s*7/.test(seg) ? prec : [0, 1, 2, 3, 4, 5, 6];
    prec = jours;
    const m = seg.match(/(\d{1,2})\s*h\s*(\d{2})?\s*[-–]\s*(\d{1,2})\s*h\s*(\d{2})?/);
    if (!m && /\b24\s*h\b/.test(seg)) { if (jours.indexOf(d) >= 0 || jours.indexOf(veille) >= 0) couvert = true; if (jours.indexOf(d) >= 0) ouvert = true; return; }
    if (!m) { if (/ferme/.test(seg) && jours.length < 7 && jours.indexOf(d) >= 0) couvert = true; return; }
    const deb = +m[1] * 60 + (+m[2] || 0); let fin = +m[3] * 60 + (+m[4] || 0); if (fin <= deb) fin += 1440;
    if (jours.indexOf(d) >= 0) { couvert = true; if (t >= deb && t < fin) ouvert = true; }
    if (fin > 1440 && jours.indexOf(veille) >= 0 && t + 1440 < fin) ouvert = true;
  });
  return ouvert ? true : couvert ? false : null;
}
function ouvertHTML(l) {
  const o = ouvertMaintenant(l.horaires);
  return o === null ? "" : '<span class="badge ' + (o ? "on" : "off") + '">' + (o ? "● Ouvert maintenant" : "● Fermé actuellement") + '</span>';
}
// ---- Distance depuis l'utilisateur ----
let maPos = null;
function distance(l) {
  if (!maPos || !aPosition(l)) return null;
  const R = 6371000, r = x => x * Math.PI / 180, dLa = r(l.lat - maPos[0]), dLo = r(l.lng - maPos[1]);
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(r(maPos[0])) * Math.cos(r(l.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function distHTML(l) {
  const d = distance(l);
  return d === null ? "" : '<p>🚶 ' + (d < 1000 ? Math.max(10, Math.round(d / 10) * 10) + " m" : (d / 1000).toFixed(1).replace(".", ",") + " km") + ' de vous (à vol d\'oiseau)</p>';
}
function localiser(ok, ko) {
  if (!navigator.geolocation) { ko(); return; }
  navigator.geolocation.getCurrentPosition(p => { maPos = [p.coords.latitude, p.coords.longitude]; ok(); }, ko, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
}
const cle = l => norm(l.nom) + "_" + (aPosition(l) ? Math.round(l.lat * 1e4) + "_" + Math.round(l.lng * 1e4) : "x");
function distM(a, b, c, d) { const R = 6371000, r = Math.PI / 180, x = (c - a) * r, y = (d - b) * r * Math.cos(a * r); return R * Math.sqrt(x * x + y * y); }
const $ = id => document.getElementById(id);

// ---- Favoris (gardés dans le téléphone, sans compte) ----
let favs = [];
try { favs = JSON.parse(localStorage.getItem("nexvia_fav") || "[]"); if (!Array.isArray(favs)) favs = []; } catch (e) { favs = []; }
const estFav = l => favs.includes(cle(l));
function basculerFav(l) {
  const k = cle(l), i = favs.indexOf(k);
  if (i >= 0) favs.splice(i, 1); else favs.push(k); if (i < 0) compter(l, "fav");
  try { localStorage.setItem("nexvia_fav", JSON.stringify(favs)); } catch (e) {}
}

function badgeHTML(l) {
  const pre = l.source === "verifie" ? "✔ Vérifié · " : l.source === "inscrit" ? "Commerce inscrit · " : l.source === "reference" ? "Référencé · " : "OpenStreetMap · ";
  const cl = l.source === "verifie" || l.source === "inscrit" ? "ok" : l.source === "reference" ? "ref" : "osm";
  return '<span class="badge ' + cl + '">' + pre + esc(l.type || CAT_LABEL[l.cat]) + '</span>' + (l.haut ? '<span class="badge prem">👑 Premium</span>' : "") + ouvertHTML(l);
}
function noteHTML(l) {
  let n = "";
  if (l.source === "reference") n = "Informations collectées, pas encore confirmées par un appel ou une visite. Appelez avant de vous déplacer.";
  if (l.source === "osm") n = "Source : OpenStreetMap (informations de la communauté). Appelez avant de vous déplacer.";
  if (l.source === "reference" && aPosition(l) && /^déduite/.test(l.posSource || "")) n += " Position déduite d'un code Plus.";
  if (l.remarque) n += (n ? " " : "") + l.remarque + ".";
  if (!aPosition(l)) n += (n ? " " : "") + "Position exacte non précisée pour l'instant.";
  return n ? '<p class="note">' + esc(n) + '</p>' : "";
}
function actionsHTML(l) {
  return '<div class="actions">' + (l.tel ? '<a class="btn" href="' + esc(telHref(l.tel)) + '">📞 Appeler</a>' : "") +
    (l.tel && !l.sansWa && (l.whatsapp || estMobile(l.tel)) ? '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waHref(l.tel)) + '">WhatsApp</a>' : "") +
    (aPosition(l) ? '<a class="btn alt" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + l.lat + ',' + l.lng + '">Itinéraire</a>' : "") + '</div>';
}
function fiche(l) {
  const col = COULEUR[l.cat] || COULEUR.autre;
  let h = '<div class="fiche">';
  if (l.photos && l.photos.length) h += '<div class="photos">' + l.photos.map(src => '<' + 'img src="' + esc(src) + '" alt="Photo de ' + esc(l.nom) + '" loading="lazy" onerror="this.remove()">').join("") + '</div>';
  else h += '<div class="banniere" style="background:' + col + '" aria-hidden="true">' + emojiDe(l) + '</div>';
  h += '<h2>' + esc(l.nom) + '</h2>' + badgeHTML(l);
  if (l.adresse) h += '<p>📍 ' + esc(adresseAff(l)) + '</p>';
  if (l.horaires) h += '<p>🕒 ' + esc(l.horaires) + '</p>';
  if (l.tel) h += '<p>📞 ' + esc(l.tel) + '</p>';
  if (l.description) h += '<p class="desc">' + esc(l.description) + '</p>';
  if (l.menuPhotos && l.menuPhotos.length) h += '<p class="menu-titre">🍽️ Menu</p><div class="photos">' + l.menuPhotos.map(src => '<' + 'img src="' + esc(src) + '" alt="Menu de ' + esc(l.nom) + '" loading="lazy" onerror="this.remove()">').join("") + '</div>';
  h += distHTML(l);
  return h + noteHTML(l) + actionsHTML(l) + '<a class="lien-signal" href="' + esc(signalHref(l)) + '">⚠️ Signaler une erreur sur cette fiche</a></div>';
}
function itemHTML(l, mode) {
  return '<article class="item" style="border-left-color:' + (COULEUR[l.cat] || COULEUR.autre) + '"><h3>' + emojiDe(l) + ' ' + esc(l.nom) + '</h3>' + badgeHTML(l) +
    (l.adresse ? '<p>📍 ' + esc(adresseAff(l)) + '</p>' : "") + (l.horaires ? '<p>🕒 ' + esc(l.horaires) + '</p>' : "") + (l.tel ? '<p>📞 ' + esc(l.tel) + '</p>' : "") + distHTML(l) +
    (aPosition(l) ? "" : '<p class="note">Position exacte non précisée pour l\'instant.</p>') +
    '<div class="actions">' + (l.tel ? '<a class="btn" href="' + esc(telHref(l.tel)) + '">Appeler</a>' : "") +
    (aPosition(l) ? '<button type="button" class="btn alt" data-voir="' + esc(cle(l)) + '">Voir sur la carte</button>' : "") +
    (mode === "fav" ? '<button type="button" class="btn alt" data-fav="' + esc(cle(l)) + '">♥ Retirer</button>' : '<button type="button" class="btn alt" data-fav="' + esc(cle(l)) + '" aria-label="Favori">' + (estFav(l) ? "♥" : "♡") + '</button>') +
    '</div></article>';
}


// ---- Statistiques anonymes (compteurs par lieu, sans donnée personnelle) ----
function compter(l, action) {
  try {
    if (!l) return;
    const id = (l.partenaire && l.adrId) ? "adr-" + l.adrId : cle(l), k = "nx_s_" + id + action;
    if (action !== "fav") { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); }
    fetch("/api/vue", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, action }), keepalive: true }).catch(() => {});
  } catch (e) {}
}
document.addEventListener("click", e => {
  const a = e.target.closest(".actions a.btn"); if (!a) return;
  const it = a.closest(".item"); const b = it && it.querySelector("[data-voir],[data-fav]");
  const l = it ? (b && trouver(b.dataset.voir || b.dataset.fav)) : courant;
  compter(l, a.classList.contains("wa") ? "wa" : a.classList.contains("alt") ? "itin" : "appel");
});

let lieux = VERIFIES.map(l => ({ ...l, source: "verifie" }));
let communeF = "toutes";
let visibles = [], filtre = "tous", mode = "carte", tab = "decouvrir", courant = null;
const trouver = k => lieux.find(l => cle(l) === k);

const sheet = $("sheet");
function setTab(t) {
  tab = t;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === "s-" + t));
  document.querySelectorAll("#tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.tab === t ? "page" : "false"));
  if (t !== "carte") fermerFiche();
  if (t === "carte" && window.__refit) window.__refit();
  if (t === "favoris") rendreFavoris();
  if (t === "compte") rendreCompte();
}
function fermerFiche() { sheet.classList.remove("open"); courant = null; }
function ouvrirFiche(l) {
  courant = l; compter(l, "vue");
  sheet.innerHTML = '<button type="button" class="x" aria-label="Fermer">✕</button><button type="button" class="fav" aria-label="Favori">' + (estFav(l) ? "♥" : "♡") + '</button>' + fiche(l);
  sheet.scrollTop = 0;
  sheet.classList.add("open");
}
sheet.addEventListener("click", e => {
  if (e.target.closest(".x")) return fermerFiche();
  if (e.target.closest(".fav") && courant) { basculerFav(courant); e.target.closest(".fav").textContent = estFav(courant) ? "♥" : "♡"; rendreFavoris(); }
});
document.querySelectorAll("#tabs button").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));

// ---------- onglet Compte (commerces) ----------
const NOMS_PLAN = { gratuit: "Gratuit", standard: "Standard", premium: "Premium" };
const COURONNE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" fill="currentColor"/></svg>';
let compteInfo;   // undefined = pas encore chargé, null = non connecté, objet = connecté
function couronneOnglet(plan) {
  const b = document.querySelector('#tabs button[data-tab="compte"]'); if (!b) return;
  b.classList.remove("standard", "premium"); if (plan === "standard" || plan === "premium") b.classList.add(plan);
}
try { couronneOnglet(localStorage.getItem("nx_plan")); } catch (e) {}
async function chargerCompte() {
  try {
    const ctl = new AbortController(), mi = setTimeout(() => ctl.abort(), 12000);
    const r = await fetch("/api/auth/moi", { credentials: "same-origin", signal: ctl.signal }), d = await r.json(); clearTimeout(mi);
    compteInfo = d && d.utilisateur ? d.utilisateur : null;
    try { localStorage.setItem("nx_plan", compteInfo && compteInfo.plan ? compteInfo.plan : ""); } catch (e) {}
    couronneOnglet(compteInfo && compteInfo.plan);
  } catch (e) { compteInfo = null; /* hors ligne ou serveur indisponible : on affiche l'écran sans compte plutôt que de rester sur « Chargement… » */ }
}
function rendreCompte() {
  const corps = $("compteCorps"), sub = $("compteSub");
  if (compteInfo === undefined) { corps.innerHTML = '<div class="vide">Chargement…</div>'; chargerCompte().then(() => { if (tab === "compte") rendreCompte(); }); return; }
  if (compteInfo === null) {
    sub.textContent = "Vous avez une adresse à présenter ?";
    corps.innerHTML = '<div class="cptc"><h3>Ajoutez votre adresse sur Nexvia RDC</h3><p>Restaurant, pharmacie, hôtel, boutique… Faites-vous trouver par les habitants de Kinshasa.</p><ul><li>Formule <b>Gratuit</b> : 1 adresse, sans paiement</li><li><b>Standard</b> 3,30 $ et <b>Premium</b> 5,30 $ par mois</li><li>Chaque fiche est vérifiée avant publication</li></ul>' +
      '<div class="actions"><a class="btn or" href="/compte/?mode=inscription&amp;type=commerce">Créer mon compte</a><a class="btn alt" href="/compte/">J\'ai déjà un compte</a><a class="btn alt" href="/tarifs/">Voir les tarifs</a></div></div>' +
      '<p class="note" style="text-align:center">Chercher un lieu reste gratuit et sans compte.</p>';
    return;
  }
  const u = compteInfo, plan = u.plan || "gratuit";
  sub.textContent = u.email;
  corps.innerHTML = '<div class="cptc"><h3>Bonjour ' + esc(u.nom || "") + '</h3>' +
    (u.commerce ? '<p><b>' + esc(u.commerce) + '</b></p><p><span class="pill ' + plan + '">' + ((plan === "standard" || plan === "premium") ? COURONNE : "") + 'Formule ' + NOMS_PLAN[plan] + '</span></p>'
      : '<p>Votre compte est prêt. Ajoutez votre adresse pour apparaître sur la carte.</p>') +
    '<div class="actions"><a class="btn or" href="/commerce/">' + (u.commerce ? "Mon espace" : "Ajouter mon adresse") + '</a>' +
    (u.admin ? '<a class="btn" href="/admin/">Administration</a>' : "") +
    '<a class="btn alt" href="/tarifs/">Voir les tarifs</a><button type="button" class="btn alt" id="cptSortir">Me déconnecter</button></div></div>';
  $("cptSortir").onclick = async () => {
    try { await fetch("/api/auth/deconnexion", { method: "POST", credentials: "same-origin", headers: { "x-nx": "1", "content-type": "application/json" }, body: "{}" }); } catch (e) {}
    compteInfo = null; try { localStorage.setItem("nx_plan", ""); } catch (e) {} couronneOnglet(""); rendreCompte();
  };
}
chargerCompte();

function rendreFavoris() {
  const items = lieux.filter(estFav).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  $("favList").innerHTML = items.length ? items.map(l => itemHTML(l, "fav")).join("") :
    '<div class="favvide"><div class="coeur">♥<span>★</span></div><b>Pas encore de favori</b><p>Ouvrez la fiche d\'un lieu sur la carte et touchez ♡ pour le retrouver ici, même sans chercher.</p><button type="button" id="favVers">🗺️ Découvrir des lieux</button></div>';
  $("favSub").textContent = items.length ? items.length + (items.length > 1 ? " adresses gardées sous la main" : " adresse gardée sous la main") : "Vos adresses, toujours sous la main";
}
$("favList").addEventListener("click", clicItems);
$("favList").addEventListener("click", e => { if (e.target.closest("#favVers")) setTab("carte"); });

function clicItems(e) {
  const v = e.target.closest("[data-voir]"), f = e.target.closest("[data-fav]");
  if (v) { const l = trouver(v.dataset.voir); if (l) ouvrirLieu(l); }
  if (f) {
    const l = trouver(f.dataset.fav); if (!l) return;
    basculerFav(l);
    if (tab === "favoris") rendreFavoris(); else if (f.textContent.length < 3) f.textContent = estFav(l) ? "♥" : "♡";
  }
}

// ---- suggestions / résultats ----
const sugg = $("sugg");
function corpsResultat(l) {
  return '<b>' + esc(l.nom) + '</b><small>' + (l.source === "verifie" ? "✔ Vérifié" : l.source === "reference" ? "Référencé" : "OpenStreetMap") + " · " + esc(l.type || CAT_LABEL[l.cat]) +
    (l.adresse ? " · " + esc(l.adresse) : "") + (aPosition(l) ? "" : " · sans position") + '</small>';
}
function meilleurs(q, n) {
  return lieux.filter(l => correspond(texteRecherche(l), q)).sort((a, b) => (correspond(a.nom, q) ? 0 : 1) - (correspond(b.nom, q) ? 0 : 1) || ordre(a) - ordre(b)).slice(0, n);
}
function majSuggestions(q) {
  const m = q && q.length >= 2 ? meilleurs(q, 6) : [];
  if (!m.length) { sugg.style.display = "none"; return; }
  sugg.innerHTML = m.map((l, i) => '<button type="button" role="option" data-s="' + i + '">' + corpsResultat(l) + '</button>').join("");
  sugg._items = m; sugg.style.display = "block";
}
function choisir(l) {
  $("recherche").value = l.nom;
  setTab("carte"); window.afficher && window.afficher(false);
  sugg.style.display = "none";
  if (aPosition(l)) ouvrirLieu(l); else setMode("liste");
}
sugg.addEventListener("mousedown", e => e.preventDefault());
sugg.addEventListener("click", e => {
  const b = e.target.closest("button[data-s]"); if (!b) return;
  sugg.style.display = "none"; choisir(sugg._items[Number(b.dataset.s)]);
});
const home = $("rechercheHome"), resHome = $("resHome");
function majHome() {
  const q = home.value.trim();
  if (q.length < 2) { resHome.innerHTML = ""; return; }
  const m = meilleurs(q, 8);
  resHome._items = m;
  resHome.innerHTML = m.length ? m.map((l, i) => '<button type="button" class="res" data-r="' + i + '"><span class="e" style="background:' + (COULEUR[l.cat] || COULEUR.autre) + '">' + emojiDe(l) + '</span><span>' + corpsResultat(l) + '</span></button>').join("") :
    '<div class="vide">Aucun lieu trouvé pour « ' + esc(q) + ' ». Essayez un autre mot.</div>';
}
home.addEventListener("input", majHome);
home.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); const q = home.value.trim(); if (!q) return; $("recherche").value = q; setTab("carte"); window.afficher && window.afficher(true, true); home.blur(); } });
resHome.addEventListener("click", e => { const b = e.target.closest("button[data-r]"); if (b) choisir(resHome._items[Number(b.dataset.r)]); });

function rendreAccueil() {
  const present = {};
  lieux.forEach(l => { present[l.cat] = (present[l.cat] || 0) + 1; });
  $("comms").innerHTML = COMMUNES_OUVERTES.map(c => '<button type="button" class="comm" data-k="' + esc(c) + '"><b>' + esc(c) + '</b><small>' + lieux.filter(l => communeDe(l) === c).length + ' lieux</small></button>').join("");
  $("cats").innerHTML = Object.keys(CATS).filter(c => present[c]).map(c =>
    '<button type="button" class="cat" data-c="' + c + '" style="background:linear-gradient(160deg,' + COULEUR[c] + '2e,#ffffff 70%)"><span class="e" style="background:' + COULEUR[c] + '">' + EMOJI[c] + '</span>' + esc(CAT_COURT[c]) + '<small>' + present[c] + '</small></button>').join("");
  const pops = lieux.filter(l => l.source !== "osm" && aPosition(l)).sort((a, b) => ordre(a) - ordre(b) || (b.tel ? 1 : 0) - (a.tel ? 1 : 0)).slice(0, 30);
  { const jour = Math.floor(Date.now() / 864e5), n = pops.length, dec = n ? jour % n : 0; pops.push(...pops.splice(0, dec)); pops.length = Math.min(pops.length, 10); }
  $("pops").innerHTML = pops.map((l, i) => '<button type="button" class="pop" data-p="' + i + '"><div class="top" style="background:' + (COULEUR[l.cat] || COULEUR.autre) + '">' + emojiDe(l) + '</div><div class="txt"><b>' + esc(l.nom) + '</b><small>' + (l.source === "verifie" ? "✔ Vérifié" : "Référencé") + " · " + esc(l.type || CAT_LABEL[l.cat]) + '</small></div></button>').join("");
  $("pops")._items = pops;
}
$("comms").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (!b) return; communeF = b.dataset.k; $("communeSel").value = communeF; filtre = "tous"; $("recherche").value = ""; $("verifies").checked = false; setTab("carte"); construireFiltres(); window.afficher && window.afficher(true); setMode("carte"); });
$("cats").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (!b) return; filtre = b.dataset.c; $("recherche").value = ""; $("verifies").checked = false; setTab("carte"); construireFiltres(); window.afficher && window.afficher(true); setMode("carte"); });
$("pres").addEventListener("click", () => {
  const b = $("pres"), txt = "📍 Voir les lieux près de moi"; b.textContent = "Recherche de votre position…";
  localiser(() => { b.textContent = txt; setTab("carte"); setMode("liste"); if (window.afficher) window.afficher(false); if (maPos && loinDeGombe(maPos)) ouvrirDemande("Il semble que vous ne soyez pas dans une commune déjà ouverte (Gombe, Ngaliema, Kintambo, Limete). Dites-nous où vous êtes pour que nous l'ajoutions."); },
    () => { b.textContent = "Position indisponible : autorisez la localisation puis réessayez"; setTimeout(() => { b.textContent = txt; }, 4000); });
});
$("partager").addEventListener("click", () => {
  const texte = "Nexvia RDC : trouvez restaurants, pharmacies et services à Kinshasa. Un projet congolais, soutenons-le !";
  const url = "https://nexviardc.com/";
  if (navigator.share) { navigator.share({ title: "Nexvia RDC", text: texte, url: url }).catch(() => {}); }
  else { window.open("https://wa.me/?text=" + encodeURIComponent(texte + " " + url), "_blank", "noopener"); }
});
$("pops").addEventListener("click", e => { const b = e.target.closest("[data-p]"); if (b) ouvrirLieu($("pops")._items[Number(b.dataset.p)]); });

// ---- demande de commune ----
const COMMUNES_DEM = ["Bandalungwa","Barumbu","Bumbu","Kalamu","Kasa-Vubu","Kimbanseke","Kinshasa","Kisenso","Lemba","Lingwala","Makala","Maluku","Masina","Matete","Mont-Ngafula","Ndjili","Ngaba","Ngiri-Ngiri","Nsele","Selembao","Autre ville du Congo"];
const CLE_DEM = "nexvia_demandes";
let communeChoisie = null;
function demandesFaites() { try { return JSON.parse(localStorage.getItem(CLE_DEM) || "[]"); } catch (e) { return []; } }
function memoriserDemande(c) { try { const l = demandesFaites(); if (!l.includes(c)) { l.push(c); localStorage.setItem(CLE_DEM, JSON.stringify(l)); } } catch (e) {} }
function messageDem(txt, type) { const m = $("demMsg"); m.hidden = !txt; m.textContent = txt || ""; m.className = type || ""; }
function dessinerDem() {
  const faites = demandesFaites();
  $("demGrille").innerHTML = COMMUNES_DEM.map(c => '<button type="button" data-c="' + esc(c) + '" class="' + (c === communeChoisie ? "on" : "") + '"' + (faites.includes(c) ? " disabled" : "") + '>' + esc(c) + (faites.includes(c) ? " ✓" : "") + '</button>').join("");
  $("demEnvoi").disabled = !communeChoisie;
}
function ouvrirDemande(intro) {
  communeChoisie = null; messageDem("");
  $("demIntro").textContent = intro || "Nexvia RDC est ouvert à Gombe, Ngaliema, Kintambo et Limete. Choisissez la commune où vous voulez la voir arriver : les plus demandées seront ajoutées en premier.";
  dessinerDem(); $("dem").classList.add("open");
}
function fermerDemande() { $("dem").classList.remove("open"); }
$("btnDem").addEventListener("click", () => ouvrirDemande());
$("demFerme").addEventListener("click", fermerDemande);
$("dem").addEventListener("click", e => { if (e.target === $("dem")) fermerDemande(); });
$("demGrille").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (!b || b.disabled) return; communeChoisie = b.dataset.c; messageDem(""); dessinerDem(); });
$("demEnvoi").addEventListener("click", () => {
  if (!communeChoisie) return;
  const c = communeChoisie, bt = $("demEnvoi"); bt.disabled = true; bt.textContent = "Envoi…";
  fetch("/api/demande", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ commune: c }) })
    .then(r => { if (!r.ok) throw new Error("echec"); return r.json(); })
    .then(j => { if (!j.ok) throw new Error("echec"); memoriserDemande(c); communeChoisie = null; dessinerDem(); messageDem("Merci ! Votre demande pour « " + c + " » a bien été reçue. Les communes les plus demandées seront ajoutées en premier. Merci de nous aider à construire Nexvia RDC.", "ok"); })
    .catch(() => { messageDem("Impossible d'envoyer votre demande pour le moment. Vérifiez votre connexion puis réessayez.", "err"); dessinerDem(); })
    .finally(() => { bt.textContent = "Envoyer ma demande"; bt.disabled = !communeChoisie; });
});
function loinDeGombe(pos) { const R = 6371, r = x => x * Math.PI / 180, la = -4.3050, lo = 15.2915; const a = Math.sin(r(pos[0] - la) / 2) ** 2 + Math.cos(r(la)) * Math.cos(r(pos[0])) * Math.sin(r(pos[1] - lo) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(a)) > 12; }

// ---- installation ----
let invite = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); invite = e;
  $("installTxt").innerHTML = 'Ajoutez Nexvia RDC à votre écran d\'accueil pour l\'ouvrir comme une application.<br><button type="button" id="btnInstall">Installer</button>';
  $("btnInstall").addEventListener("click", () => { invite.prompt(); invite = null; });
});
window.addEventListener("appinstalled", () => { $("install").style.display = "none"; });
if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) $("install").style.display = "none";
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) { try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) {} }

function setMode(m) {
  mode = m;
  $("map").style.display = m === "carte" ? "block" : "none";
  $("moi").style.display = m === "carte" ? "block" : "none";
  $("liste").style.display = m === "liste" ? "block" : "none";
  $("btnCarte").setAttribute("aria-pressed", String(m === "carte"));
  $("btnListe").setAttribute("aria-pressed", String(m === "liste"));
  if (m === "carte" && window.__refit) window.__refit();
}
function construireFiltres() {
  const present = new Set(lieux.map(l => l.cat)), box = $("chips");
  box.innerHTML = "";
  ["tous"].concat(Object.keys(CATS).filter(c => present.has(c))).forEach(c => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c === "tous" ? "Tous" : CATS[c];
    b.setAttribute("aria-pressed", String(c === filtre));
    b.addEventListener("click", () => { filtre = c; construireFiltres(); afficher(true); });
    box.appendChild(b);
  });
}

if (typeof L === "undefined") {
  $("cartewrap").style.display = "none"; $("statut").style.display = "none"; $("erreur").style.display = "block";
  rendreAccueil();
} else {
  const map = L.map("map", { zoomControl: true }).setView([-4.308, 15.298], 14);
  window.__carte = map;
  // La carte se remplit toujours : dès que son conteneur change de taille (onglet affiché, fenêtre redimensionnée), on recalcule et on recadre sur Gombe si elle est restée dézoomée.
  window.__refit = () => { map.invalidateSize(); if (map.getZoom() < 11) map.fitBounds(GOMBE); };
  if (window.ResizeObserver) new ResizeObserver(() => window.__refit()).observe($("map"));
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, updateWhenIdle: false, keepBuffer: 4, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> (ODbL)' }).addTo(map);

  const groupe = L.layerGroup().addTo(map); // lieux vérifiés : toujours visibles
  const bulles = L.markerClusterGroup({
    maxClusterRadius: 55, disableClusteringAtZoom: 17, showCoverageOnHover: false, spiderfyOnMaxZoom: false, zoomToBoundsOnClick: true,
    iconCreateFunction: c => { const n = c.getChildCount(), t = n < 10 ? 40 : n < 50 ? 46 : 52; return L.divIcon({ className: "", html: '<div class="cl">' + n + '</div>', iconSize: [t, t] }); }
  }).addTo(map);

  function iconeDe(l) {
    const col = COULEUR[l.cat] || COULEUR.autre, v = l.source === "verifie", t = v ? 42 : 34;
    return L.divIcon({ className: "", iconSize: [t, t], iconAnchor: [t / 2, t / 2],
      html: '<div class="ico' + (v ? " ver" : "") + '" style="background:' + col + ';font-size:' + Math.round(t * 0.5) + 'px">' + emojiDe(l) + (v ? '<i class="ok">✔</i>' : "") + (l.tel && !v ? '<i class="tel">☎</i>' : "") + '</div>' });
  }
  function creerMarqueur(l) {
    const m = L.marker([l._dlat !== undefined ? l._dlat : l.lat, l._dlng !== undefined ? l._dlng : l.lng], { icon: iconeDe(l), title: l.nom, keyboard: true, zIndexOffset: l.source === "verifie" ? 1000 : l.tel ? 300 : 0 });
    m.on("click", () => { ouvrirFiche(l); centrerSurLieu(l, false); });
    return m;
  }
  function centrerSurLieu(l, zoom) {
    const ll = [l.lat, l.lng];
    if (zoom) map.setView(ll, Math.max(map.getZoom(), 17)); else map.panTo(ll);
    setTimeout(() => { const h = sheet.offsetHeight; if (h) map.panBy([0, Math.round(h / 2)]); }, zoom ? 60 : 320);
  }
  window.ouvrirLieu = function (l) {
    setTab("carte"); setMode("carte");
    map.invalidateSize();
    ouvrirFiche(l);
    if (aPosition(l)) centrerSurLieu(l, true);
  };
  map.on("click", fermerFiche);

  function afficher(recentrer, ouvrir) {
    // Lieux à la même position exacte : on écarte légèrement leurs pastilles (≈ 12 m) pour qu'elles restent toutes touchables.
    const grp = {};
    lieux.forEach(l => { if (aPosition(l)) { const k = l.lat.toFixed(5) + "," + l.lng.toFixed(5); (grp[k] = grp[k] || []).push(l); } });
    Object.keys(grp).forEach(k => { const g = grp[k]; if (g.length < 2) { g[0]._dlat = undefined; g[0]._dlng = undefined; return; }
      g.forEach((l, i) => { const ang = (2 * Math.PI * i) / g.length - Math.PI / 2; l._dlat = l.lat + 0.00011 * Math.sin(ang); l._dlng = l.lng + 0.00011 * Math.cos(ang); }); });
    const q = $("recherche").value.trim(), seulV = $("verifies").checked, seulO = $("ouverts").checked;
    groupe.clearLayers(); bulles.clearLayers();
    visibles = lieux.filter(l => (q || communeF === "toutes" || communeDe(l) === communeF) && (q || filtre === "tous" || l.cat === filtre) && (q || !seulV || l.source === "verifie") && (q || !seulO || ouvertMaintenant(l.horaires) === true) && (!q || correspond(texteRecherche(l), q)));
    const pts = [], autres = [];
    visibles.forEach(l => {
      l._m = null;
      if (!aPosition(l)) return;
      const m = creerMarqueur(l); l._m = m; pts.push([l.lat, l.lng]);
      autres.push(m);
    });
    bulles.addLayers(autres);
    rendreListe(); majSuggestions(q);
    const n = s => visibles.filter(l => l.source === s).length, sans = visibles.length - pts.length;
    let txt = visibles.length + " lieu(x) : " + n("verifie") + " vérifié(s), " + n("reference") + " référencé(s), " + n("osm") + " OpenStreetMap.";
    if (sans) txt += " " + sans + " sans position (voir la Liste).";
    if (q && !visibles.length) txt = "Aucun lieu trouvé pour « " + q + " ». Essayez un autre mot.";
    else if (!q && !visibles.length && communeF !== "toutes") txt = "Les lieux de " + communeF + " arrivent bientôt.";
    $("statut").textContent = txt;
    if (recentrer && mode === "carte") {
      const actif = q || communeF !== "toutes" || filtre !== "tous" || seulV || seulO;
      const proches = pts.filter(p => p[0] > ZONE_LARGE.s && p[0] < ZONE_LARGE.n && p[1] > ZONE_LARGE.o && p[1] < ZONE_LARGE.e), base = proches.length ? proches : pts;
      if (!q && communeF !== "toutes") { if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.08), { maxZoom: 15 }); else map.fitBounds(BORNES_COMMUNE[communeF] || GOMBE); } else if (!actif) map.fitBounds(GOMBE); else if (base.length) map.fitBounds(L.latLngBounds(base).pad(0.2), { maxZoom: 16 });
    }
    if (ouvrir && visibles.length) {
      if (visibles.length === 1 && pts.length === 1) window.ouvrirLieu(visibles[0]);
      else if (!pts.length || visibles.length === 1) setMode("liste");
    }
  }
  window.afficher = afficher;
  function rendreListe() {
    const items = visibles.slice().sort((a, b) => { if (maPos) { const da = distance(a), db = distance(b); if (da !== null || db !== null) return (da === null ? 1e12 : da) - (db === null ? 1e12 : db); } return ordre(a) - ordre(b) || a.nom.localeCompare(b.nom, "fr"); }).slice(0, 300);
    const vide = communeF !== "toutes" && !$("recherche").value.trim() && !lieux.some(l => communeDe(l) === communeF)
      ? '<p class="vide">Les lieux de <b>' + esc(communeF) + '</b> arrivent bientôt.<br>Vous avez un commerce dans cette commune ? <a href="/commerce/">Inscrivez-le sur Nexvia RDC</a>.</p>'
      : '<p class="vide">Aucun lieu à afficher avec ces filtres.</p>';
    $("liste").innerHTML = items.length ? items.map(l => itemHTML(l, "liste")).join("") : vide;
  }
  $("liste").addEventListener("click", clicItems);

  const champ = $("recherche");
  let minuterie = null;
  champ.addEventListener("input", () => { afficher(false); clearTimeout(minuterie); minuterie = setTimeout(() => { if (champ.value.trim().length >= 2) afficher(true); }, 450); });
  champ.addEventListener("blur", () => setTimeout(() => { sugg.style.display = "none"; }, 150));
  champ.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(minuterie); afficher(true, true); sugg.style.display = "none"; champ.blur(); } });
  $("communeSel").addEventListener("change", e => { communeF = COMMUNES_OUVERTES.includes(e.target.value) ? e.target.value : "toutes"; afficher(true); });
  $("verifies").addEventListener("change", () => afficher(true));
  $("ouverts").addEventListener("change", () => afficher(true));
  $("btnCarte").addEventListener("click", () => { setMode("carte"); afficher(true); });
  $("btnListe").addEventListener("click", () => setMode("liste"));

  let moiMarker = null;
  $("moi").addEventListener("click", () => {
    const st = $("statut");
    if (!navigator.geolocation) { st.textContent = "La localisation n'est pas disponible sur cet appareil."; return; }
    navigator.geolocation.getCurrentPosition(p => {
      const ll = [p.coords.latitude, p.coords.longitude]; maPos = ll; rendreListe();
      if (moiMarker) map.removeLayer(moiMarker);
      moiMarker = L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="mine"></div>', iconSize: [20, 20] }), interactive: false }).addTo(map);
      map.setView(ll, 16);
    }, () => { st.textContent = "Position indisponible. Autorisez la localisation dans votre navigateur, puis réessayez."; });
  });

  // ---- données supplémentaires ----
  const dejaPresent = l => lieux.some(x => norm(x.nom) === norm(l.nom) || (norm(l.nom).length >= 7 && norm(x.nom).length >= 7 && (norm(x.nom).indexOf(norm(l.nom)) >= 0 || norm(l.nom).indexOf(norm(x.nom)) >= 0) && (!aPosition(l) || !aPosition(x) || distM(x.lat, x.lng, l.lat, l.lng) < 300)) || (aPosition(l) && aPosition(x) && x.cat === l.cat && distM(x.lat, x.lng, l.lat, l.lng) < 40));
  // Garde uniquement les lieux de Kinshasa : exclut la rive nord du fleuve (Brazzaville, République du Congo).
  // Lieux signalés comme n'étant pas à Kinshasa (à compléter au besoin).
  const EXCLUS_NOMS = [/^\s*(le\s+)?glad\b/i];
  function horsRDC(lat, lng, adresse, tel, nom) {
    if (EXCLUS_NOMS.some(re => re.test(String(nom || "")))) return true;
    if (typeof lat === "number" && typeof lng === "number" && (lat > -4.285 || lat < -4.46 || lng < 15.17 || lng > 15.43)) return true;
    if (/brazzaville|poto-?poto|bacongo|moungali|ouenz[eé]|talanga[iï]|mfilou|makél?él?é?kélé/i.test([nom, adresse].join(" "))) return true;
    return /^\s*(\+|00)?\s*242/.test(String(tel || "").replace(/[^\d+]/g, "")) ;
  }
  function ajouterRefs(liste) {
    // Règle d'affichage : sans adresse exploitable (vide, ou juste le nom de la commune), le lieu n'est pas affiché.
    // « Vérifié » = adresse + téléphone + horaires renseignés ; « Référencé » = adresse seule ou fiche incomplète.
    (liste || []).forEach(r => { if (!r.nom || !r.adresse || norm(r.adresse) === norm(r.commune || "") || dejaPresent(r) || horsRDC(r.lat, r.lng, r.adresse, r.tel, r.nom)) return;
      lieux.push({ nom: r.nom, cat: CATS[r.cat] ? r.cat : "autre", type: r.type || "", adresse: r.adresse || "", tel: r.tel || "", horaires: r.horaires || "", lat: r.lat, lng: r.lng, posSource: r.posSource || "", commune: COMMUNES_OUVERTES.includes(r.commune) ? r.commune : "", remarque: r.remarque || "", source: (r.adresse && r.tel && r.horaires) ? "verifie" : "reference" }); });
  }
  function ajouterOSM(data) {
    (data.elements || []).forEach(el => {
      const t = el.tags || {}, terrain = ["pitch", "sports_centre", "stadium"].includes(t.leisure);
      if (!t.name && !terrain) return;
      const nom = t.name || (t.sport === "soccer" ? "Terrain de football" : "Terrain de sport");
      const lat = el.lat !== undefined ? el.lat : el.center && el.center.lat, lng = el.lon !== undefined ? el.lon : el.center && el.center.lon;
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const cat = catOSM(t);
      const l = { nom, cat, type: CAT_LABEL[cat], lat, lng, source: "osm", religion: t.religion || "", emoji: t.amenity === "cafe" ? "☕" : t.amenity === "fast_food" ? "🍔" : t.amenity === "nightclub" ? "🎶" : "",
        adresse: [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" "), tel: t.phone || t["contact:phone"] || "", horaires: t.opening_hours || "" };
      if (!dejaPresent(l) && !horsRDC(l.lat, l.lng, l.adresse, l.tel, l.nom)) lieux.push(l);
    });
  }
  // Commerces inscrits et validés par l'équipe (comptes commerçants) : placés dans la liste, Premium en tête.
  function ajouterCommerces(d) {
    if (!d || !d.ok || !Array.isArray(d.commerces)) return;
    const CAT_API = { distributeur: "atm", "station-service": "station" };
    d.commerces.forEach(c => {
      if (!c || !c.nom) return;
      const c0 = CAT_API[c.categorie] || c.categorie, cat = CATS[c0] ? c0 : "autre";
      if (c.lieu_existant) { const n = norm(c.lieu_existant); for (let i = lieux.length - 1; i >= 0; i--) if (!lieux[i].partenaire && norm(lieux[i].nom) === n) lieux.splice(i, 1); }
      const photo = id => "/api/photo/" + Number(id);
      lieux.push({ adrId: Number(c.id) || 0, nom: c.nom, cat, type: CAT_LABEL[cat], adresse: c.adresse || "", commune: c.commune || "Gombe", tel: c.tel || "", horaires: c.horaires || "", description: c.description || "",
        lat: typeof c.lat === "number" ? c.lat : undefined, lng: typeof c.lng === "number" ? c.lng : undefined,
        source: c.badge ? "verifie" : "inscrit", partenaire: true, formule: c.formule, haut: !!c.haut, whatsapp: !!c.whatsapp, sansWa: !c.whatsapp,
        photos: (c.photos || []).map(photo), menuPhotos: (c.menu_photos || []).map(photo) });
    });
  }
  // Chargement des données : chaque fichier est lu en parallèle, puis ajouté dans un ordre fixe (références, communes, OpenStreetMap)
  // dès qu'il est prêt. Un fichier lent, absent ou abîmé ne bloque plus les autres (et la carte se met à jour au fur et à mesure).
  const lireJSON = (u, delai) => { const ctl = typeof AbortController !== "undefined" ? new AbortController() : null, t = ctl ? setTimeout(() => ctl.abort(), delai || 20000) : null;
    return fetch(u, { cache: "no-cache", signal: ctl ? ctl.signal : undefined }).then(r => { if (!r.ok) throw new Error("absent"); return r.json(); }).catch(() => null).finally(() => { if (t) clearTimeout(t); }); };

  construireFiltres(); afficher(true); rendreAccueil();
  const sources = [
    ["references.json", ajouterRefs], ["communes/kintambo.json", ajouterRefs], ["communes/ngaliema.json", ajouterRefs], ["communes/limete.json", ajouterRefs],
    ["osm.json", ajouterOSM]
  ].map(([u, fn]) => ({ u, fn, p: lireJSON(u) }));
  if (AFFICHAGE_PUBLIC) sources.splice(4, 0, { u: "/api/public/commerces", fn: ajouterCommerces, p: lireJSON("/api/public/commerces", 10000) });
  (async () => {
    const manque = [], casse = [];
    for (const src of sources) {
      const d = await src.p;
      if (!d) { manque.push(src.u); continue; }
      try { src.fn(d); } catch (e) { casse.push(src.u); console.error("Nexvia : données ignorées (" + src.u + ")", e); }
      construireFiltres(); afficher(false); rendreAccueil();
    }
    construireFiltres(); afficher(true); rendreAccueil();
    if (casse.length) $("statut").textContent += " (Certaines données n'ont pas pu être lues : " + casse.join(", ") + ".)";
    else if (manque.indexOf("references.json") >= 0 && manque.indexOf("osm.json") >= 0) $("statut").textContent += " (Données supplémentaires pas encore ajoutées.)";
  })();
}

