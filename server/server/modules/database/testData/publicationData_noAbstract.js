
module.exports = [
{ ID: 1,
  title: "Orchestrating nomadic mashups using workflows",
  fileName: 'Orchestrating_nomadic_mashups_using_workflows.pdf',
  authors: 
   [ { firstName: "Eline", lastName: "Philips" },
     { firstName: "Andoni Lombide", lastName: "Carreton" },
     { firstName: "Niels", lastName: "Jonckheere" },
     { firstName: "Viviane", lastName: "Jonckers" },
     { firstName: "Wolfgang", lastName: "De Meuter" } ],
  type : "proceeding",
  booktitle: "Proceedings of the 3rd and 4th International Workshop on Web APIs and Services Mashups",
  organisation :"ACM",
  year: "2010",
  researchDomains: [{major: "Computer and Information Science", minor: "Programming Languages"}],
  citations: 3,
  abstract:  "Middleware for mashups is currently not able to compose the services residing in a nomadic network. Its transient 
connections and connection volatility result in a highly dynamic
environment where services can appear and disappear
at any point in time. The consequence is that these services
must be discovered at runtime in an ad hoc fashion and
must execute asynchronously to prevent a disconnected service
to block the execution of an entire mashup. Orchestrating
loosely coupled asynchronously executing services calls
for a process-aware approach. This paper proposes the use
of workflow patterns to enable a high level specification of
the interactions between the mobile services constituting a
nomadic mashup.",
  private: false,
  keywords: ['computer', 'API', 'VUB'],
  article_url: "http://soft.vub.ac.be/~njonchee/publications/Mashups2009.pdf" },

/*
{ ID: 2,
  title: "Automatic parallelization of side-effecting higher-order scheme programs",
  fileName: 'Automatic_parallelization_of_side-effecting_higher-order_scheme_programs.pdf',
  authors: 
   [ { firstName: "Jens", lastName: "Nicolay" },
     { firstName: "Coen", lastName: "De Roover" },
     { firstName: "Viviane", lastName: "Jonckers" },
     { firstName: "Wolfgang", lastName: "De Meuter" } ],
  type : "proceeding",
  booktitle: "Source Code Analysis and Manipulation (SCAM), 2011 11th IEEE International Working Conference on",
  organisation :"IEEE",
  year: "2011",
  citations: 1,
  abstract: "The multi-core revolution heralds a challenging
era for software maintainers. Manually parallelizing large
sequential code bases is often infeasible. In this paper, we
present a program transformation that automatically parallelizes
real-life Scheme programs. The transformation has to be
instantiated with an interprocedural dependence analysis that
exposes parallelization opportunities in a sequential program.
To this end, we extended a state-of-the art analysis that copes
with higher-order procedures and side effects. Our parallelizing
transformation exploits all opportunities for parallelization
that are exposed by the dependence analysis. Experiments
demonstrate that this brute-force approach realizes scalable
speedups in certain benchmarks, while others would benefit
from a more selective parallelization.",
  private: false,
  keywords: ['computer', 'IEEE', 'VUB'],
  article_url: "http://soft.vub.ac.be/~njonchee/publications/Mashups2009.pdf" },
*/

{ ID: 3,
  title: "A formal approach to model refactoring and model refinement",
  fileName: 'A_formal_approach_to_model_refactoring_and_model_refinement.pdf',
  authors: 
   [ { firstName: "Ragnhild", lastName: "Van Der Straeten" },
     { firstName: "Viviane", lastName: "Jonckers" },
     { firstName: "Tom", lastName: "Mens" }],
  type : "journal",
  journal : "Software \& Systems Modeling",
  publisher :"Springer",
  year: "2007",
  researchDomains: [{major: "Computer and Information Science", minor: "Programming Languages"}, {major: "Computer and Information Science", minor: "Software Engineering"}]
  citations: 45,
  abstract:  "Model-driven engineering is an emerging
software engineering approach that relies on model
transformation. Typical kinds of model transformations
are model refinement and model refactoring. Whenever
such a transformation is applied to a consistent model,
we would like to know whether the consistency is preserved
by the transformation. Therefore, in this article,
we formally define and explore the relation between
behaviour inheritance consistency of a refined model
with respect to the original model, and behaviour preservation
of a refactored model with respect to the original
model. As it turns out, there is a strong similarity
between these notions of behaviour consistency and
behaviour preservation. To illustrate this claim, we formalised
the behaviour specified by UML 2.0 sequence
and protocol state machine diagrams. We show how the
reasoning capabilities of description logics, a decidable
fragment of first-order logic, can be used in a natural
way to detect behaviour inconsistencies. These reasoning
capabilities can be used in exactly the same way to
detect behaviour preservation violations during model
refactoring.",
  private: false,
  keywords: ['computer', 'model', 'VUB'],
  article_url: "http://people.irisa.fr/Jean-Marc.Jezequel/enseignement/M2RI/MDE/Articles/VanDerStaeten07.pdf" },

{ ID: 4,
  title: "Supporting model refactorings through behaviour inheritance consistencies",
  fileName: 'Supporting_Model_Refactorings_through_Behaviour_Inheritance_Consistencies.pdf',
  authors: 
   [ { firstName: "Ragnhild", lastName: "Van Der Straeten" },
     { firstName: "Viviane", lastName: "Jonckers" },
     { firstName: "Tom", lastName: "Mens" }],
  type : "proceeding",
  booktitle : "UML 2004—The Unified Modeling Language. Modeling Languages and Applications",
  organisation :"Springer",
  year: "2004",
  researchDomains: [{major: "Computer and Information Science", minor: "Software Engineering"}],
  citations: 41,
  abstract: 'empty',
  private: false,
  keywords: ['computer', 'UML', 'VUB'],
  article_url: "http://informatique.umons.ac.be/ftp_infofs/2004/UML2004-ModelRefactoring.pdf" },


{ ID: 5,
  title: "Incremental resolution of model inconsistencies",
  fileName: 'Maintaining_Consistency_between_UML_Models_with_Description_Logic_Tools.pdf',
  authors: 
   [ { firstName: "Ragnhild", lastName: "Van Der Straeten" },
     { firstName: "Tom", lastName: "Mens" }],
  type : "proceeding",
  booktitle : "Recent Trends in Algebraic Development Techniques",
  organisation :"Springer",
  year: "2007",
  researchDomains: [{major: "Computer and Information Science", minor: "Software Engineering"}],
  citations: 30,
  abstract: 'empty',
  private: false,
  keywords: ['computer', 'Algebra', 'VUB'],
  article_url: "http://www.cs.toronto.edu/~jsimmond/docs/TomMensEtAl.pdf" },


{ ID: 6,
  title: "Determining dynamic coupling in JavaScript using object type inference",
  fileName: 'Determining_dynamic_coupling_in_JavaScript_using_object_type_inference.pdf',
  authors: 
   [ { firstName: "Jens", lastName: "Nicolay" },
    { firstName: "Coen", lastName: "De Roover" },
    { firstName: "Wolfgang", lastName: "De Meuter" },
     { firstName: "Carlos", lastName: "Noguera" }],
  type : "proceeding",
  booktitle : "Source Code Analysis and Manipulation (SCAM), 2013 IEEE 13th International Working Conference on",
  organisation :"IEEE",
  year: "2013",
  researchDomains: [{major: "Computer and Information Science", minor: "Programming Languages"}, {major: "Computer and Information Science", minor: "Software Engineering"}],
  citations: 1,
  abstract: 'empty',
  private: false,
  keywords: ['computer', 'analysis', 'VUB'],
  article_url: "ftp://prog.vub.ac.be/tech_report/2013/vub-soft-tr-13-07.pdf" },

{ ID: 7,
  title: "Verification of business process quality constraints based on visual process patterns",
  fileName: 'Verification_of_Business_Process_Quality_Constraints_Based_on_Visual_Process_Patterns.pdf',
  authors: 
   [ { firstName: "Alexander", lastName: "Forster" },
     { firstName: "Gregor", lastName: "Engels" },
     { firstName: "Tim", lastName: "Schattkowsky" },
     { firstName: "Ragnhild", lastName: "Van Der Straeten" } ],
  type : "proceeding",
  booktitle: "Theoretical Aspects of Software Engineering, 2007. TASE07. First Joint IEEE/IFIP Symposium on",
  organisation :"IEEE",
  year: "2007",
  researchDomains: [{major: "Computer and Information Science", minor: "Programming Languages"}],
  citations: 69,
  abstract: 'empty',
  private: false,
  keywords: ['computer', 'software', 'VUB'],
  article_url: "http://is.uni-paderborn.de/uploads/tx_sibibtex/Verification_of_Business_Process_Quality_Constraints_Based_on_Visual_Process_Patterns.pdf" }

]