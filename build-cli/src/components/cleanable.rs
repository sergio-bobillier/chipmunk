use crate::errors::{BuildError, BuildErrorTypes};

use super::Component;
use super::bindings::Bindings;

pub enum Cleanable {
  Bindings(Bindings)
}

impl Cleanable {
  pub fn new(component_name: String) -> Result<Cleanable, BuildError> {
    match component_name.as_str() {
      "bindings" => Ok(Cleanable::Bindings(Bindings::new())),
      _ => Err(BuildError::new(BuildErrorTypes::UnknownComponent(component_name)))
    }
  }

  pub fn name(&self) -> &str {
    match self {
      Cleanable::Bindings(bindings) => { bindings.name() }
    }
  }

  pub fn clean(&self) {
    match self {
      Cleanable::Bindings(bindings) => { bindings.clean() }
    }
  }
}
