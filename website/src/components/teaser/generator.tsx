import * as React from 'react';
import { stringify } from 'qs';
import SpriteCollection from '../../types/spriteCollection';
import { GoGear, GoLinkExternal } from 'react-icons/go';
import {
  Collapse,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from 'reactstrap';
import spriteCollections from '../../options';
import Link from '@docusaurus/Link';
import { createAvatar } from '@dicebear/avatars';

type State = {
  spriteCollection: SpriteCollection;
  seed: string;
  advancedOptions: {
    [key: string]: any;
  };
  showAdvancedOptions: boolean;
  spriteDropdownOpen: boolean;
};

export default class Generator extends React.Component<{}, State> {
  private seedInputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this.state = {
      spriteCollection: spriteCollections[0],
      seed: '',
      advancedOptions: this.getSpriteCollectionAdvancedOptions(spriteCollections[0]),
      showAdvancedOptions: false,
      spriteDropdownOpen: false,
    };

    this.onChangeSpriteCollection = this.onChangeSpriteCollection.bind(this);
    this.onChangeSeed = this.onChangeSeed.bind(this);
    this.onToggleShowAdvancedOptions = this.onToggleShowAdvancedOptions.bind(this);
    this.onChangeAdvancedOptions = this.onChangeAdvancedOptions.bind(this);
    this.toggleSpriteDropdownOpen = this.toggleSpriteDropdownOpen.bind(this);

    this.seedInputRef = React.createRef();
  }

  componentDidMount() {
    if (this.seedInputRef.current) {
      this.seedInputRef.current.focus();
    }
  }

  toggleSpriteDropdownOpen() {
    this.setState((prevState) => {
      return {
        spriteDropdownOpen: !prevState.spriteDropdownOpen,
      };
    });
  }

  getSpriteCollectionAdvancedOptions(spriteCollection: SpriteCollection) {
    let advancedOptions = {};

    Object.keys(spriteCollection.options)
      .filter((field) => (spriteCollection.options[field] ? true : false))
      .forEach((field) => {
        let meta = spriteCollection.options[field];

        advancedOptions[field] = Array.isArray(meta.defaultValue) ? [...meta.defaultValue] : meta.defaultValue;
      });

    return advancedOptions;
  }

  onChangeSpriteCollection(e: React.MouseEvent<HTMLDivElement>) {
    spriteCollections.forEach((spriteCollection) => {
      if (spriteCollection.id === e.currentTarget.getAttribute('data-id')) {
        this.setState({
          spriteCollection: spriteCollection,
          advancedOptions: this.getSpriteCollectionAdvancedOptions(spriteCollection),
        });
      }
    });
  }

  onChangeSeed(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      seed: e.target.value,
    });
  }

  onToggleShowAdvancedOptions(e: React.MouseEvent) {
    this.setState((prevState) => {
      return {
        showAdvancedOptions: !prevState.showAdvancedOptions,
      };
    });

    e.preventDefault();
  }

  onChangeAdvancedOptions(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    let target = e.target;

    this.setState((prevState) => {
      let advancedOptions = prevState.advancedOptions;
      let meta = this.state.spriteCollection.options[target.name];

      switch (meta.type) {
        case 'select':
          advancedOptions[target.name] = target.value;

          break;

        case 'checkbox':
          let index = advancedOptions[target.name].indexOf(target.value);

          if (target['checked']) {
            if (-1 === index) {
              advancedOptions[target.name].push(target.value);
            }
          } else {
            if (index > -1) {
              advancedOptions[target.name].splice(index, 1);
            }
          }

          break;

        case 'switch':
          let values = meta.values;

          if (target['checked']) {
            advancedOptions[target.name] = values ? values[1] : 1;
          } else {
            advancedOptions[target.name] = values ? values[0] : 0;
          }

          break;

        case 'range':
          advancedOptions[target.name] = parseInt(target.value);

          break;

        case 'number':
          advancedOptions[target.name] = parseInt(target.value);

          break;

        case 'color':
          advancedOptions[target.name] = target.value;

          break;
      }

      return {
        advancedOptions: advancedOptions,
      };
    });
  }

  getAvatarOptions() {
    let options = {};

    Object.keys(this.state.spriteCollection.options)
      .filter((key) => (this.state.spriteCollection.options[key] ? true : false))
      .map((key) => {
        let optionsKey = this.state.spriteCollection.options[key].alias || key;
        let defaultValue = this.state.spriteCollection.options[key].defaultValue;

        if (JSON.stringify(defaultValue) !== JSON.stringify(this.state.advancedOptions[key])) {
          options[optionsKey] = this.state.advancedOptions[key];
        }
      });

    return options;
  }

  getAvatarSvg() {
    let options = this.getAvatarOptions();

    return createAvatar(this.state.spriteCollection.style, {
      ...options,
      seed: this.state.seed,
      base64: true,
    });
  }

  getAvatarUrl() {
    let options = this.getAvatarOptions();

    let params = stringify(options, {
      encodeValuesOnly: true,
      arrayFormat: 'brackets',
    });

    return `https://avatars.dicebear.com/api/${this.state.spriteCollection.id}/${encodeURIComponent(
      this.state.seed
    )}.svg${params ? '?' + params : ''}`;
  }

  render() {
    let avatar = this.getAvatarUrl();
    let avatarSvg = this.getAvatarSvg();

    return (
      <div className="min-vh-lg-100 d-flex align-items-center">
        <div className="w-100">
          <div className={`generator ${this.state.showAdvancedOptions ? 'position-sticky' : ''}`}>
            <div className="generator-body">
              <div className="generator-avatar">
                <Link href={avatar} target="_blank">
                  <img src={avatarSvg} alt="avatar" />
                </Link>
              </div>
              <div className="generator-head">
                <div className="row">
                  <div className="col">
                    <a href="#" onClick={this.onToggleShowAdvancedOptions} id="ShowAdvancedOptionsTooltip">
                      <GoGear size={20} />
                    </a>
                    <UncontrolledTooltip placement="top" target="ShowAdvancedOptionsTooltip">
                      Advanced options
                    </UncontrolledTooltip>
                  </div>
                  <div className="col text-right">
                    <Link href={avatar} target="_blank" id="OpenNewTabTooltip">
                      <GoLinkExternal size={20} />
                    </Link>
                    <UncontrolledTooltip placement="top" target="OpenNewTabTooltip">
                      Open in new tab
                    </UncontrolledTooltip>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <InputGroupButtonDropdown
                  addonType="prepend"
                  isOpen={this.state.spriteDropdownOpen}
                  toggle={this.toggleSpriteDropdownOpen}
                >
                  <DropdownToggle outline caret>
                    {this.state.spriteCollection.id}
                  </DropdownToggle>
                  <DropdownMenu>
                    {spriteCollections.map((spritecollection) => {
                      return (
                        <DropdownItem
                          key={spritecollection.id}
                          onClick={this.onChangeSpriteCollection}
                          data-id={spritecollection.id}
                        >
                          {spritecollection.id}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </InputGroupButtonDropdown>
                <input
                  ref={this.seedInputRef}
                  className="form-control form-control-lg text-center"
                  placeholder="your-custom-seed"
                  value={this.state.seed}
                  onChange={this.onChangeSeed}
                  maxLength={512}
                />
              </div>
              <small className="form-text text-muted text-center">
                Don't use sensitive or personal data as seed! And please check the{' '}
                <Link to="/licenses" className="text-muted font-weight-bolder">
                  design licenses
                </Link>{' '}
                before use.
              </small>
            </div>
          </div>

          <Collapse isOpen={this.state.showAdvancedOptions}>
            <div className="generator generator--options">
              <div className="generator-body">
                {Object.keys(this.state.spriteCollection.options)
                  .filter((key) => (this.state.spriteCollection.options[key] ? true : false))
                  .filter((key) => this.state.spriteCollection.options[key].alias != key)
                  .map((key) => {
                    let field = this.state.spriteCollection.options[key];
                    let id = 'advanced_' + key;

                    return (
                      <div className="form-group row" key={key}>
                        <label
                          htmlFor={id}
                          className={`col-sm-3 col-form-label ${field.type !== 'select' ? 'py-0' : ''} pr-0`}
                          title={key}
                        >
                          {key}
                        </label>
                        <div className="col-sm-9">
                          {field.type === 'select' ? (
                            <select
                              id={id}
                              name={key}
                              className="custom-select"
                              value={this.state.advancedOptions[key]}
                              onChange={this.onChangeAdvancedOptions}
                            >
                              {field.values?.map((value) => (
                                <option key={value}>{value}</option>
                              ))}
                            </select>
                          ) : (
                            ''
                          )}

                          {field.type === 'checkbox'
                            ? field.values?.map((value) => (
                                <div className="custom-control custom-switch" key={value}>
                                  <input
                                    name={key}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={id + '_' + value}
                                    checked={this.state.advancedOptions[key].indexOf(value) !== -1}
                                    onChange={this.onChangeAdvancedOptions}
                                    value={value}
                                  />
                                  <label className="custom-control-label" htmlFor={id + '_' + value}>
                                    {value}
                                  </label>
                                </div>
                              ))
                            : ''}

                          {field.type === 'range' ? (
                            <input
                              id={id}
                              name={key}
                              type="range"
                              className="d-block custom-range"
                              min={field.values ? field.values[0] : 0}
                              max={field.values ? field.values[1] : 1}
                              onChange={this.onChangeAdvancedOptions}
                              value={this.state.advancedOptions[key]}
                            />
                          ) : (
                            ''
                          )}

                          {field.type === 'number' ? (
                            <input
                              id={id}
                              name={key}
                              type="number"
                              className="form-control"
                              min={field.values ? field.values[0] : 0}
                              max={field.values ? field.values[1] : 1}
                              onChange={this.onChangeAdvancedOptions}
                              value={this.state.advancedOptions[key]}
                            />
                          ) : (
                            ''
                          )}

                          {field.type === 'color' ? (
                            <input
                              id={id}
                              name={key}
                              type="color"
                              className="form-control"
                              onChange={this.onChangeAdvancedOptions}
                              value={this.state.advancedOptions[key]}
                            />
                          ) : (
                            ''
                          )}

                          {field.type === 'switch' ? (
                            <div className="custom-control custom-switch">
                              <input
                                id={id}
                                name={key}
                                type="checkbox"
                                className="custom-control-input"
                                onChange={this.onChangeAdvancedOptions}
                                checked={
                                  this.state.advancedOptions[key] == (field.values ? field.values[1] : undefined)
                                }
                              />
                              <label className="custom-control-label" htmlFor={id} />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    );
                  })}
                <div className="form-group">
                  <small className="form-text text-muted text-center d-block">
                    <Link
                      to={`/styles/${this.state.spriteCollection.id}#options`}
                      target="_blank"
                      className="text-reset"
                    >
                      Advanced options
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </Collapse>

          <Collapse isOpen={!this.state.showAdvancedOptions}>
            <div className="generator-create-your-own">
              Create your own
              <img src={'img/arrow.svg'} alt="arrow" />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}
