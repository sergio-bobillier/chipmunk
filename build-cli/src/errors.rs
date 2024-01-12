use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub struct BuildError {
  error_type: BuildErrorTypes
}

impl fmt::Display for BuildError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
      write!(f, "{}", self.error_type)
  }
}

impl Error for BuildError {}

impl BuildError {
  pub fn new(error_type: BuildErrorTypes) -> Self {
    Self { error_type }
  }
}

#[derive(Debug)]
pub enum BuildErrorTypes {
  UnknownComponent(String)
}

impl fmt::Display for BuildErrorTypes {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      BuildErrorTypes::UnknownComponent(component_name) => write!(f, "Unknown component '{}'", component_name)
    }
  }
}
