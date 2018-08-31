using FluentValidation;
using vega.Core.Models.ViewModels;

namespace vega.Extensions.Validators
{    public class RegistrationViewModelValidator : AbstractValidator<RegistrationViewModel>
    {
        public RegistrationViewModelValidator()
        {
            RuleFor(vm => vm.Email).NotEmpty().WithMessage("Email can not be empty.");
            RuleFor(vm => vm.Password).NotEmpty().WithMessage("Password can not be empty.");
            RuleFor(vm => vm.FirstName).NotEmpty().WithMessage("First Name can not be empty.");
            RuleFor(vm => vm.LastName).NotEmpty().WithMessage("Last Name can not be empty.");
            RuleFor(vm => vm.Location).NotEmpty().WithMessage("Location can not be empty.");
        }
    }
}