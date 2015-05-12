webapp.factory('researchDomainService', function($http){

    var researchDomains = [
    {
        major:   {ID: "1", name: "Arts and Literature"},
        minor:   [
        {ID: "1", name: "Architecture"},
        {ID: "2", name: "Art History"},
        {ID: "3", name: "Children's Literature"},
        {ID: "4", name: "Culture Heritage"},
        {ID: "5", name: "Film and TV Studies"},
        {ID: "6", name: "Latin"},
        {ID: "7", name: "Literature"},
        {ID: "8", name: "Miscellaneous"},
        {ID: "9", name: "Music"},
        {ID: "10", name: "Visual and Performing Arts"}
        ]
    },
    {
        major:   {ID: "2", name: "Astronomy / Astrophysics / Space Science"},
        minor:   [
        {ID: "11", name: "Celestial Mechanics"},
        {ID: "12", name: "Cosmology"},
        {ID: "13", name: "Extragalactic Astronomy"},
        {ID: "14", name: "Interstellar Matter"},
        {ID: "15", name: "Meteors"},
        {ID: "16", name: "Miscellaneous"},
        {ID: "17", name: "Solar Terrestrial Physics"},
        {ID: "18", name: "Stars"},
        {ID: "19", name: "The Sun"},
        {ID: "20", name: "Theoretical Astrophysics"}
        ]
    },
    {
        major:   {ID: "3", name: "Biological Sciences"},
        minor:   [
        {ID: "21", name: "Agricultural Science"},
        {ID: "22", name: "Algology"},
        {ID: "23", name: "Animal Behavior"},
        {ID: "24", name: "Animal Physiology"},
        {ID: "25", name: "Biochemistry"},
        {ID: "455", name: "Bioinformatics"},
        {ID: "26", name: "Biometry"},
        {ID: "27", name: "Biophysics"},
        {ID: "28", name: "Biotechnology"},
        {ID: "29", name: "Botany"},
        {ID: "30", name: "Cellular Biology"},
        {ID: "31", name: "Embryology"},
        {ID: "32", name: "Entomology"},
        {ID: "33", name: "Food Science and Technology"},
        {ID: "34", name: "Forestry Science"},
        {ID: "35", name: "Genetics"},
        {ID: "36", name: "Hydrobiology"},
        {ID: "37", name: "Ichthyology"},
        {ID: "38", name: "Immunology"},
        {ID: "39", name: "Limnology"},
        {ID: "40", name: "Marine Biology"},
        {ID: "41", name: "Microbiology"},
        {ID: "42", name: "Microscopy"},
        {ID: "43", name: "Miscellaneous"},
        {ID: "44", name: "Molecular Biology"},
        {ID: "45", name: "Mycology"},
        {ID: "462", name: "Neurobiology"},
        {ID: "46", name: "Ornithology"},
        {ID: "47", name: "Parasitology"},
        {ID: "48", name: "Plant Sciences"},
        {ID: "49", name: "Soil Sciences"},
        {ID: "50", name: "Veterinary Science"},
        {ID: "51", name: "Virology"},
        {ID: "52", name: "Zoology and Animal Science"}
        ]
    },
    {
        major:   {ID: "4", name: "Business Administration"},
        minor:   [
        {ID: "53", name: "Accounting"},
        {ID: "54", name: "Actuarial Studies"},
        {ID: "55", name: "Banks and Banking"},
        {ID: "56", name: "Entrepreneurship"},
        {ID: "57", name: "Finance and Financial Services"},
        {ID: "58", name: "Human Resource Management"},
        {ID: "59", name: "Industrial Relations"},
        {ID: "60", name: "Insurance"},
        {ID: "61", name: "Intellectual Property"},
        {ID: "62", name: "International Business"},
        {ID: "453", name: "Logistics"},
        {ID: "63", name: "Management Information Systems"},
        {ID: "64", name: "Management and Communication"},
        {ID: "65", name: "Management and Strategy"},
        {ID: "66", name: "Marketing"},
        {ID: "67", name: "Miscellaneous"},
        {ID: "68", name: "Production, Operations and Manufacturing Management"},
        {ID: "69", name: "Public and Non-Profit Management"},
        {ID: "70", name: "Quality Control"},
        {ID: "71", name: "Taxation"},
        {ID: "72", name: "Technological Change"}
        ]
    },
    {
        major:   {ID: "5", name: "Chemistry"},
        minor:   [
        {ID: "73", name: "Analytical Chemistry"},
        {ID: "74", name: "Applied Chemistry"},
        {ID: "519", name: "Biochemistry"},
        {ID: "75", name: "Chromatography"},
        {ID: "76", name: "Crystallography"},
        {ID: "77", name: "Industrial and Engineering Chemistry"},
        {ID: "78", name: "Inorganic Chemistry"},
        {ID: "79", name: "Mass Spectrometry"},
        {ID: "80", name: "Miscellaneous"},
        {ID: "81", name: "Nuclear Magnetic Resonance"},
        {ID: "82", name: "Organic Chemistry"},
        {ID: "83", name: "Petroleum"},
        {ID: "84", name: "Photochemistry"},
        {ID: "85", name: "Physical Chemistry"},
        {ID: "86", name: "Polymer Chemistry"},
        {ID: "87", name: "Radiochemistry"},
        {ID: "88", name: "Stereochemistry"},
        {ID: "518", name: "Theoretical Chemistry"}
        ]
    },
    {
        major:   {ID: "6", name: "Computer and Information Science"},
        minor:   [
        {ID: "89", name: "Algorithms and Computational Theory"},
        {ID: "90", name: "Artificial Intelligence"},
        {ID: "91", name: "Computer Architecture"},
        {ID: "492", name: "Computer Security"},
        {ID: "93", name: "Data Communication and Networks"},
        {ID: "94", name: "Database Systems"},
        {ID: "95", name: "Design Automation"},
        {ID: "96", name: "Electronic Commerce"},
        {ID: "97", name: "Electronic Publishing"},
        {ID: "482", name: "Graphics"},
        {ID: "92", name: "Human-Computer Interaction"},
        {ID: "98", name: "Information Retrieval"},
        {ID: "99", name: "Information Science"},
        {ID: "100", name: "Information Storage"},
        {ID: "101", name: "Miscellaneous"},
        {ID: "102", name: "Multimedia Systems and Applications"},
        {ID: "103", name: "Neural Networks"},
        {ID: "104", name: "Operating Systems"},
        {ID: "105", name: "Programming Languages"},
        {ID: "106", name: "Real-Time Systems"},
        {ID: "107", name: "Software Engineering"},
        {ID: "108", name: "Systems and Control Theory"}
        ]
    },
    {
        major:   {ID: "7", name: "Earth Sciences"},
        minor:   [
        {ID: "109", name: "Atmospheric Sciences"},
        {ID: "110", name: "Earth-Surface Processes"},
        {ID: "111", name: "Economic Geology"},
        {ID: "112", name: "Geochemistry"},
        {ID: "113", name: "Geology"},
        {ID: "114", name: "Geophysics"},
        {ID: "115", name: "Geotechnical Engineering"},
        {ID: "116", name: "Hydrology"},
        {ID: "117", name: "Meteorology"},
        {ID: "118", name: "Mineralogy"},
        {ID: "119", name: "Miscellaneous"},
        {ID: "120", name: "Oceanography"},
        {ID: "121", name: "Paleontology"},
        {ID: "122", name: "Petrology"},
        {ID: "123", name: "Remote Sensing/Photogrammetry"},
        {ID: "124", name: "Sedimentology"},
        {ID: "125", name: "Seismology/Seismics"},
        {ID: "126", name: "Volcanism"}
        ]
    },
    {
        major:   {ID: "8", name: "Economics"},
        minor:   [
        {ID: "127", name: "Agricultural Economics"},
        {ID: "128", name: "Cultural Economics"},
        {ID: "129", name: "Econometrics"},
        {ID: "130", name: "Economic Development, Technological Change and Growth"},
        {ID: "131", name: "Economic Systems"},
        {ID: "132", name: "Economics History"},
        {ID: "133", name: "Environmental Economics"},
        {ID: "134", name: "Industrial Management"},
        {ID: "135", name: "International Economics"},
        {ID: "136", name: "Law and Economics"},
        {ID: "137", name: "Macroeconomics"},
        {ID: "138", name: "Mathematical Economics"},
        {ID: "139", name: "Microeconomics"},
        {ID: "140", name: "Miscellaneous"},
        {ID: "141", name: "Monetary Economics"},
        {ID: "142", name: "Political Economics"},
        {ID: "143", name: "Public Economics"},
        {ID: "144", name: "Quantitative Methods"},
        {ID: "145", name: "Regional Economics"},
        {ID: "146", name: "Rural Development"},
        {ID: "147", name: "Urban Economics"}
        ]
    },
    {
        major:   {ID: "9", name: "Education"},
        minor:   [
        {ID: "148", name: "Business Education"},
        {ID: "149", name: "Comparative Education"},
        {ID: "150", name: "Counselling"},
        {ID: "151", name: "Curriculum Studies"},
        {ID: "152", name: "Education Research"},
        {ID: "153", name: "Educational Administration"},
        {ID: "154", name: "Educational Change"},
        {ID: "155", name: "Educational Technology"},
        {ID: "156", name: "Language Education"},
        {ID: "157", name: "Mathematics Education"},
        {ID: "158", name: "Medical Education"},
        {ID: "159", name: "Miscellaneous"},
        {ID: "160", name: "Physical Education"},
        {ID: "161", name: "Science Education"},
        {ID: "162", name: "Sociology of Education"},
        {ID: "163", name: "Special Education"},
        {ID: "164", name: "Teacher Education"},
        {ID: "165", name: "Testing and Evaluation"}
        ]
    },
    {
        major:   {ID: "10", name: "Electrical and Electronic Engineering"},
        minor:   [
        {ID: "180", name: "(Sub-)Surface Sensing Technologies and Systems"},
        {ID: "166", name: "Acoustics, Speech and Signal Processing"},
        {ID: "167", name: "Antennas and Propagation"},
        {ID: "168", name: "Circuits and Systems"},
        {ID: "169", name: "Communication"},
        {ID: "170", name: "Control Systems"},
        {ID: "171", name: "Electron Devices"},
        {ID: "172", name: "Image Processing"},
        {ID: "173", name: "Information Theory"},
        {ID: "174", name: "Lasers and Electro-optics"},
        {ID: "175", name: "Microprocessors"},
        {ID: "176", name: "Miscellaneous"},
        {ID: "177", name: "Power Systems"},
        {ID: "178", name: "Robotics and Automation"},
        {ID: "179", name: "Semiconductors"},
        {ID: "181", name: "Telecommunications"},
        {ID: "182", name: "Vehicular Technology"},
        {ID: "183", name: "Wireless and Mobile Communication"}
        ]
    },
    {
        major:   {ID: "11", name: "Engineering"},
        minor:   [
        {ID: "184", name: "Aeronautics"},
        {ID: "185", name: "Aerospace Engineering"},
        {ID: "186", name: "Automobiles"},
        {ID: "187", name: "Chemical Engineering"},
        {ID: "188", name: "Civil Engineering"},
        {ID: "189", name: "Construction"},
        {ID: "190", name: "Energy"},
        {ID: "191", name: "Manufacturing Technology"},
        {ID: "192", name: "Mechanical Engineering"},
        {ID: "193", name: "Miscellaneous"},
        {ID: "194", name: "Nanotechnology"},
        {ID: "195", name: "Nuclear Engineering"},
        {ID: "196", name: "Offshore Engineering"},
        {ID: "197", name: "Railroads"},
        {ID: "198", name: "Reliability and Risk Analysis"},
        {ID: "199", name: "Welding"}
        ]
    },
    {
        major:   {ID: "12", name: "Environmental Sciences"},
        minor:   [
        {ID: "200", name: "Biodegradation"},
        {ID: "201", name: "Ecology"},
        {ID: "202", name: "Environmental Biotechnology"},
        {ID: "203", name: "Environmental Conservation"},
        {ID: "204", name: "Environmental Engineering"},
        {ID: "205", name: "Environmental Fluid Dynamics"},
        {ID: "206", name: "Environmental Planning"},
        {ID: "207", name: "Environmental Toxicology"},
        {ID: "208", name: "Fisheries"},
        {ID: "209", name: "Global Environmental Change"},
        {ID: "210", name: "Miscellaneous"},
        {ID: "211", name: "Pollution"}
        ]
    },
    {
        major:   {ID: "13", name: "Humanities"},
        minor:   [
        {ID: "212", name: "Archaeology"},
        {ID: "213", name: "Bible"},
        {ID: "214", name: "Buddhism"},
        {ID: "215", name: "Catholicism"},
        {ID: "216", name: "Christianity"},
        {ID: "217", name: "Church"},
        {ID: "218", name: "Feminism"},
        {ID: "219", name: "History"},
        {ID: "221", name: "Islam"},
        {ID: "222", name: "Judaism"},
        {ID: "223", name: "Languages and Literature"},
        {ID: "225", name: "Miscellaneous"},
        {ID: "226", name: "Muslim"},
        {ID: "220", name: "Queer Studies"},
        {ID: "227", name: "Regional and Cultural Studies"},
        {ID: "228", name: "Religion"},
        {ID: "229", name: "Theology"}
        ]
    },
    {
        major:   {ID: "14", name: "Law"},
        minor:   [
        {ID: "230", name: "Air and Space Law"},
        {ID: "231", name: "Business, Commercial, Consumer and Financial Law"},
        {ID: "232", name: "Comparative Law"},
        {ID: "233", name: "Computer Law, Intellectual Property and Media Law"},
        {ID: "234", name: "Constitutional Law"},
        {ID: "235", name: "Economic Law"},
        {ID: "236", name: "Employment and Social Security Law"},
        {ID: "237", name: "Energy and Natural Resources Law"},
        {ID: "238", name: "Entertainment, Sports and Gaming Law"},
        {ID: "239", name: "European Community Law"},
        {ID: "242", name: "Family Law"},
        {ID: "243", name: "Health Law"},
        {ID: "244", name: "Human Rights"},
        {ID: "245", name: "International Law"},
        {ID: "246", name: "Law of the Sea/Maritime Law"},
        {ID: "247", name: "Legal Practice"},
        {ID: "248", name: "Legal Theory"},
        {ID: "249", name: "Miscellaneous"},
        {ID: "250", name: "Private, Civil, Criminal Law and Litigation"},
        {ID: "251", name: "Property Law"},
        {ID: "252", name: "Regional Law"},
        {ID: "253", name: "Sociology of Law"},
        {ID: "254", name: "Taxation Law"},
        {ID: "255", name: "Transport Law"}
        ]
    },
    {
        major:   {ID: "15", name: "Linguistics"},
        minor:   [
        {ID: "256", name: "Applied Linguistics"},
        {ID: "257", name: "Computational Linguistics"},
        {ID: "258", name: "English Language"},
        {ID: "259", name: "French Language"},
        {ID: "260", name: "German Language"},
        {ID: "261", name: "Historical Linguistics"},
        {ID: "262", name: "Miscellaneous"},
        {ID: "263", name: "Philology"},
        {ID: "515", name: "Phonetics"},
        {ID: "264", name: "Psycholinguistics"},
        {ID: "265", name: "Semantics"},
        {ID: "266", name: "Sociolinguistics"},
        {ID: "267", name: "Syntax"},
        {ID: "268", name: "Theoretical Linguistics"}
        ]
    },
    {
        major:   {ID: "16", name: "Management Science / Operations Research"},
        minor:   [
        {ID: "269", name: "Applied Probability"},
        {ID: "270", name: "Decision Analysis"},
        {ID: "271", name: "Game Theory"},
        {ID: "272", name: "Management Science"},
        {ID: "273", name: "Mathematical Programming"},
        {ID: "274", name: "Miscellaneous"},
        {ID: "275", name: "Organizational Science"}
        ]
    },
    {
        major:   {ID: "17", name: "Materials Science"},
        minor:   [
        {ID: "276", name: "Cement"},
        {ID: "277", name: "Ceramics"},
        {ID: "278", name: "Glass"},
        {ID: "279", name: "Materials Science"},
        {ID: "280", name: "Materials Synthesis"},
        {ID: "281", name: "Metallurgy"},
        {ID: "282", name: "Miscellaneous"},
        {ID: "283", name: "Paper Industry"},
        {ID: "284", name: "Plastics"},
        {ID: "285", name: "Processes"},
        {ID: "286", name: "Properties"},
        {ID: "287", name: "Rubber"},
        {ID: "288", name: "Testing"},
        {ID: "289", name: "Wood"}
        ]
    },
    {
        major:   {ID: "18", name: "Mathematics"},
        minor:   [
        {ID: "290", name: "Algebra"},
        {ID: "291", name: "Analysis"},
        {ID: "292", name: "Control and Optimization"},
        {ID: "293", name: "Discrete Mathematics"},
        {ID: "294", name: "Foundations, Sets and Categories"},
        {ID: "295", name: "Geometry"},
        {ID: "296", name: "Groups"},
        {ID: "297", name: "Information Theory"},
        {ID: "298", name: "Mathematical Modelling and Industrial Mathematics"},
        {ID: "299", name: "Mathematics Education"},
        {ID: "300", name: "Miscellaneous"},
        {ID: "301", name: "Number Theory"},
        {ID: "302", name: "Probability"},
        {ID: "303", name: "Statistics"},
        {ID: "511", name: "Topology"}
        ]
    },
    {
        major:   {ID: "19", name: "Medicine"},
        minor:   [
        {ID: "304", name: "AIDS"},
        {ID: "305", name: "Alcoholism and Addiction"},
        {ID: "306", name: "Allergy"},
        {ID: "307", name: "Anesthesiology"},
        {ID: "308", name: "Arthritis"},
        {ID: "309", name: "Asthma"},
        {ID: "310", name: "Biomedical Engineering"},
        {ID: "311", name: "Cancer"},
        {ID: "312", name: "Cardiology"},
        {ID: "313", name: "Clinical Molecular and Microbiology"},
        {ID: "314", name: "Communication Disorders"},
        {ID: "315", name: "Dentistry and Oral Surgery"},
        {ID: "316", name: "Dermatology"},
        {ID: "317", name: "Emergency Medicine and Critical Care"},
        {ID: "318", name: "Endocrinology"},
        {ID: "319", name: "Environmental"},
        {ID: "320", name: "Epidemiology"},
        {ID: "321", name: "Family"},
        {ID: "322", name: "Gastroenterology and Hepatology"},
        {ID: "323", name: "General Medicine"},
        {ID: "324", name: "Geriatrics and Aging"},
        {ID: "325", name: "Gynecology"},
        {ID: "326", name: "Hematology"},
        {ID: "327", name: "Histology"},
        {ID: "328", name: "History of Medicine"},
        {ID: "329", name: "Internal Medicine"},
        {ID: "330", name: "Medical Imaging"},
        {ID: "331", name: "Miscellaneous"},
        {ID: "332", name: "Nephrology, Urology"},
        {ID: "333", name: "Neurobiology"},
        {ID: "334", name: "Neurology"},
        {ID: "335", name: "Neuroscience"},
        {ID: "472", name: "Nursing"},
        {ID: "336", name: "Nutrition and Metabolism"},
        {ID: "338", name: "Obesity"},
        {ID: "339", name: "Obstetrics"},
        {ID: "340", name: "Occupational Therapy"},
        {ID: "341", name: "Occupational and Environmental"},
        {ID: "342", name: "Oncology"},
        {ID: "343", name: "Ophthalmology"},
        {ID: "344", name: "Optometry"},
        {ID: "345", name: "Orthopedics"},
        {ID: "346", name: "Otolaryngology"},
        {ID: "347", name: "Pain Medicine and Palliative Care"},
        {ID: "348", name: "Pathology and Forensics"},
        {ID: "349", name: "Pediatrics"},
        {ID: "350", name: "Pharmacology"},
        {ID: "351", name: "Pharmacy"},
        {ID: "352", name: "Physiology"},
        {ID: "520", name: "Physiotherapy"},
        {ID: "353", name: "Public Health and Community Medicine"},
        {ID: "354", name: "Reproductive Medicine"},
        {ID: "355", name: "Respiratory and Pulmonary"},
        {ID: "356", name: "Rheumatology"},
        {ID: "357", name: "Surgery"},
        {ID: "358", name: "Toxicology"},
        {ID: "359", name: "Tropical"}
        ]
    },
    {
        major:   {ID: "20", name: "Philosophy"},
        minor:   [
        {ID: "360", name: "Epistemology"},
        {ID: "361", name: "Ethics"},
        {ID: "362", name: "Logic"},
        {ID: "363", name: "Metaphysics"},
        {ID: "364", name: "Miscellaneous"},
        {ID: "365", name: "Ontology"},
        {ID: "366", name: "Phenomenology"},
        {ID: "367", name: "Philosophy of Biology"},
        {ID: "368", name: "Philosophy of Education"},
        {ID: "369", name: "Philosophy of Language"},
        {ID: "370", name: "Philosophy of Law"},
        {ID: "371", name: "Philosophy of Medicine"},
        {ID: "372", name: "Philosophy of Mind"},
        {ID: "373", name: "Philosophy of Religion"},
        {ID: "374", name: "Philosophy of Science"},
        {ID: "375", name: "Philosophy of Technology"},
        {ID: "376", name: "Philosophy of the Social Sciences"},
        {ID: "377", name: "Postmodernism"}
        ]
    },
    {
        major:   {ID: "21", name: "Physics"},
        minor:   [
        {ID: "378", name: "Atomic and Molecular Physics"},
        {ID: "379", name: "Biomedical Physics"},
        {ID: "380", name: "Chemical Physics"},
        {ID: "381", name: "Computational Physics"},
        {ID: "382", name: "Condensed Matter Physics"},
        {ID: "383", name: "Fluid Mechanics/Dynamics"},
        {ID: "461", name: "High Energy Physics"},
        {ID: "384", name: "Mathematical Physics"},
        {ID: "385", name: "Miscellaneous"},
        {ID: "386", name: "Nuclear Physics"},
        {ID: "387", name: "Optics and Optoelectronics"},
        {ID: "517", name: "Physics Education Research"},
        {ID: "388", name: "Radiation"},
        {ID: "389", name: "Radioisotopes"},
        {ID: "390", name: "Statistical Physics"},
        {ID: "391", name: "Surface and Interface Physics"},
        {ID: "392", name: "Thermodynamics"}
        ]
    },
    {
        major:   {ID: "22", name: "Psychology"},
        minor:   [
        {ID: "393", name: "Assessment and Evaluation"},
        {ID: "394", name: "Child Abuse"},
        {ID: "395", name: "Child Behavior"},
        {ID: "396", name: "Clinical and Counselling Psychology"},
        {ID: "397", name: "Cognition"},
        {ID: "398", name: "Cognitive Psychology"},
        {ID: "399", name: "Community and Environmental Psychology"},
        {ID: "400", name: "Cross Cultural Psychology"},
        {ID: "401", name: "Depression"},
        {ID: "402", name: "Developmental Psychology"},
        {ID: "403", name: "Drug Abuse"},
        {ID: "404", name: "Educational Psychology"},
        {ID: "463", name: "Evolutionary Psychology"},
        {ID: "405", name: "Experimental Psychology"},
        {ID: "406", name: "Family Therapy"},
        {ID: "407", name: "Health Psychology/Behavioral Medicine"},
        {ID: "408", name: "Humanistic and Transpersonal Psychology"},
        {ID: "409", name: "Industrial and Organizational Psychology"},
        {ID: "410", name: "Intelligence Testing"},
        {ID: "411", name: "Miscellaneous"},
        {ID: "412", name: "Parapsychology"},
        {ID: "414", name: "Personality Psychology"},
        {ID: "415", name: "Political Psychology"},
        {ID: "416", name: "Psychiatry"},
        {ID: "417", name: "Psychoanalysis"},
        {ID: "418", name: "Psychology and Law"},
        {ID: "419", name: "Psychopharmacology"},
        {ID: "420", name: "Psychotherapy"},
        {ID: "421", name: "Rehabilitation"},
        {ID: "422", name: "Schizophrenia"},
        {ID: "516", name: "Social Psychology"},
        {ID: "460", name: "Transpersonal Psychology"}
        ]
    },
    {
        major:   {ID: "23", name: "Social Sciences"},
        minor:   [
        {ID: "423", name: "Africa"},
        {ID: "424", name: "Anthropology"},
        {ID: "425", name: "Archaeology"},
        {ID: "426", name: "Communication"},
        {ID: "427", name: "Criminology"},
        {ID: "428", name: "Demography"},
        {ID: "429", name: "Ethnology"},
        {ID: "501", name: "Futurology"},
        {ID: "430", name: "Geography"},
        {ID: "431", name: "Gerontology"},
        {ID: "454", name: "Library and Information Science"},
        {ID: "512", name: "Marketing Research"},
        {ID: "513", name: "Media Studies"},
        {ID: "432", name: "Methodology of Social Sciences"},
        {ID: "434", name: "Miscellaneous"},
        {ID: "435", name: "Native Americans"},
        {ID: "436", name: "Political Science"},
        {ID: "437", name: "Public Opinion"},
        {ID: "438", name: "Public Welfare"},
        {ID: "439", name: "Social Issues"},
        {ID: "440", name: "Social Work"},
        {ID: "441", name: "Sociology"}
        ]
    },
    {
        major:   {ID: "24", name: "Sports and Recreation"},
        minor:   [
        {ID: "442", name: "Adapted Physical Activity"},
        {ID: "443", name: "Fitness, Training and Injury"},
        {ID: "444", name: "Health and Wellness"},
        {ID: "445", name: "History of Sport and Recreation"},
        {ID: "446", name: "Kinesiology"},
        {ID: "447", name: "Management and Marketing"},
        {ID: "448", name: "Miscellaneous"},
        {ID: "449", name: "Professional Sports"},
        {ID: "450", name: "Recreation and Leisure"},
        {ID: "451", name: "Social Sciences"},
        {ID: "452", name: "Tourism"}
        ]
    },
    {
        major:   {ID: "25", name: "Design"},
        minor:   [
        {ID: "457", name: "Communication Design"},
        {ID: "459", name: "Fashion Design"},
        {ID: "458", name: "Graphic Design"},
        {ID: "456", name: "Industrial Design"},
        {ID: "473", name: "Miscellaneous"}
        ]
    }
    ]

    var selected = []
    var showMajor = false;

    var toggleShow = function(){
        showMajor = !showMajor;
    }

    var toggleMajor = function(id){
     researchDomains[id-1].expanded = !researchDomains[id-1].expanded; 
     console.log("lol")  ;
 }

 var removeFromSelected = function(entry){
        var idx = selected.indexOf(entry);
        if (idx > -1){
            selected.splice(idx, 1);
        } else {
            console.log("didn't find major/minor entry");
        }

        researchDomains.forEach(function(majorEntry){
            majorEntry.minor.forEach(function(minorEntry){
                if ((majorEntry.major.name == entry.major)&&(minorEntry.name == entry.minor)){
                    minorEntry.selected = false;    
                }
            });
        });

    }

 var toggleMinor = function(majorID, minorIDX){
    var val = researchDomains[majorID-1].minor[minorIDX].selected
    researchDomains[majorID-1].minor[minorIDX].selected = !val;

    var majorName = researchDomains[majorID-1].major.name;
    var minorName = researchDomains[majorID-1].minor[minorIDX].name
    var entry = { major: majorName, minor: minorName };

        if (val){ //remove
            removeFromSelected(entry);
        } else { // add
            selected.push(entry);
        }
    }

    var init = function(){
        researchDomains.forEach(function(entry){
            entry.expanded = false;
            entry.minor.forEach(function(minorEntry){
                minorEntry.selected = false;
            });
        });
        selected = [];
    }

    init();

    var service = {
        domains : researchDomains,
        toggleMajor : toggleMajor,
        toggleMinor : toggleMinor,
        selected : selected,
        removeFromSelected : removeFromSelected,
        showMajor : showMajor,
        toggleShow : toggleShow

    }

    return service;

});