import { assert } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  shallow,
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import {
  Table,
  Icon,
} from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';

import YearPicker from '../../src/pickers/YearPicker';
import YearView from '../../src/views/YearView';

Enzyme.configure({ adapter: new Adapter() });

describe('<YearPicker />', () => {
  it.only('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<YearPicker initializeWith={date} />);
    assert(moment.isMoment(wrapper.state('date')), 'has moment instance in `date` state field');
    assert(wrapper.state('date').isSame(date), 'initialize `date` state field with moment provided in `initializeWith` prop');
  });

  it.only('render <YearView /> properly', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);
    assert(wrapper.is(YearView), 'renders <YearView />');
    assert(_.isArray(wrapper.prop('years')), 'provide array to `years` prop on YearView');
    assert.equal(wrapper.prop('years').length, 12, 'provide array of length 12 to `years` prop on YearView');
    wrapper.prop('years').forEach((year) => {
      assert(_.isString(year), 'contains strings');
    });
    assert(_.isFunction(wrapper.prop('onNextPageBtnClick')), 'provide function for `onNextPageBtnClick` prop on YearView');
    assert(_.isFunction(wrapper.prop('onPrevPageBtnClick')), 'provide function for `onPrevPageBtnClick` prop on YearView');
    assert(_.isFunction(wrapper.prop('onYearClick')), 'provide function for `onYearClick` prop on YearView');
    assert(_.isBoolean(wrapper.prop('hasPrevPage')), 'provide boolean for `hasPrevPage` prop on YearView');
    assert(_.isBoolean(wrapper.prop('hasNextPage')), 'provide boolean for `hasNextPage` prop on YearView');
    assert(_.has(wrapper.props(), 'active'), 'provide `active` prop to YearView');
    assert(_.has(wrapper.props(), 'disabled'), 'provide `disabled` prop to YearView');
  });

  it.only('pass unhandled props to <YearView />', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<YearPicker
      a="prop a"
      b="prop b"
      initializeWith={date} />);
    assert(wrapper.is(YearView), 'renders <YearView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to YearView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to YearView');
  });
});

describe('<YearPicker />: buildYears', function() {
  it.only('has `buildYears` method that works properly', () => {
    const date = moment('2015-05-01');
    const shouldBuildYears = [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ];
    const wrapper = shallow(<YearPicker initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().buildYears), 'has the method');
    assert(_.isArray(wrapper.instance().buildYears()), 'method returns array');
    assert.equal(wrapper.instance().buildYears().length, 12, 'method returns array');
    _.forEach(wrapper.instance().buildYears(), (year) => {
      assert(_.isString(year), 'contains string');
    });
    _.forEach(wrapper.instance().buildYears(), (year, i) => {
      assert.equal(year, shouldBuildYears[i], 'contains expected year');
    });
  });
});

describe('<YearPicker />: getActiveYear', function() {
  it.only('works properly when`value` prop provided', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<YearPicker
      initializeWith={date}
      value={moment('2016-01-01')} />);
    assert(_.isFunction(wrapper.instance().getActiveYear), 'has the method');
    assert(_.isNumber(wrapper.instance().getActiveYear()), 'method returns number');
    assert.equal(wrapper.instance().getActiveYear(), 2016, 'method returns active year given in `value` prop');
  });

  it.only('works properly when `value` prop is undefined', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveYear()), 'method returns undefined if `value` prop is undefined');
  });
});

describe('<YearPicker />: getDisabledYears', function() {
  it.only('works properly when `disable` prop is provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      disable={[moment('2017-01-01'), moment('2019-01-01')]}
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().getDisabledYears), 'has the method');
    assert(_.isArray(wrapper.instance().getDisabledYears()), 'method returns an array');
    assert.equal(wrapper.instance().getDisabledYears().length, 2, 'method returns an array of length 2');
    _.forEach(wrapper.instance().getDisabledYears(), (disabledIndex) => {
      assert(_.isNumber(disabledIndex), 'contains numbers only');
    });
    assert(wrapper.instance().getDisabledYears().indexOf(2) >= 0, 'year at position 2 is disabled');
    assert(wrapper.instance().getDisabledYears().indexOf(4) >= 0, 'year at position 4 is disabled');
  });

  it.only('works properly when `disable` prop is undefined', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().getDisabledYears), 'has the method');
    assert(_.isUndefined(wrapper.instance().getDisabledYears()), 'method returns undefined');
  });
});

describe('<YearPicker />: isNextPageAvailable', function() {
  describe('`maxDate`, `disable` props are not provided', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);

    it.only('returns true', () => {
      assert(_.isFunction(wrapper.instance().isNextPageAvailable), 'has the method');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'returns true');
    });
  });

  describe('`maxDate` prop is less than last year on the page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      maxDate={moment('2025-01-01')}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'returns false');
    });
  });

  describe('`maxDate` prop is equal to the last year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      maxDate={moment('2026-01-01')}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'returns false');
    });
  });

  describe('`maxDate` prop is bigger than the last year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      maxDate={moment('2027-01-01')}
      initializeWith={date} />);

    it.only('returns true', () => {
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'returns true');
    });
  });

  describe('`disable` contains some years from next page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      disable={[moment('2027-01-01'), moment('2028-01-01'), moment('2030-01-01')]}
      initializeWith={date} />);

    it.only('returns true', () => {
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'returns true');
    });
  });

  describe('`disable` contains all years from the next page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      disable={[
        moment('2019-01-01'),
        moment('2027-01-01'), moment('2028-01-01'), moment('2029-01-01'),
        moment('2030-01-01'), moment('2031-01-01'), moment('2032-01-01'),
        moment('2033-01-01'), moment('2034-01-01'), moment('2035-01-01'),
        moment('2036-01-01'), moment('2037-01-01'), moment('2038-01-01'),
        moment('2050-01-01'),
      ]}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'returns false');
    });
  });
});

describe('<YearPicker />: isPrevPageAvailable', function() {
  describe('`minDate`, `disable` props are not provided', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);

    it.only('returns true', () => {
      assert(_.isFunction(wrapper.instance().isPrevPageAvailable), 'has the method');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'returns true');
    });
  });

  describe('`minDate` prop is bigger than first year on the page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      minDate={moment('2025-01-01')}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'returns false');
    });
  });

  describe('`minDate` prop is equal to the first year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      minDate={moment('2015-01-01')}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'returns false');
    });
  });

  describe('`minDate` prop is less than first year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      minDate={moment('2014-01-01')}
      initializeWith={date} />);

    it.only('returns true', () => {
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'returns true');
    });
  });

  describe('`disable` contains some years from previous page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      disable={[moment('2014-01-01'), moment('2013-01-01'), moment('2000-01-01')]}
      initializeWith={date} />);

    it.only('returns true', () => {
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'returns true');
    });
  });

  describe('`disable` contains all years from the previous page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      disable={[
        moment('1999-01-01'),
        moment('2003-01-01'), moment('2004-01-01'), moment('2005-01-01'),
        moment('2006-01-01'), moment('2007-01-01'), moment('2008-01-01'),
        moment('2009-01-01'), moment('2010-01-01'), moment('2011-01-01'),
        moment('2012-01-01'), moment('2013-01-01'), moment('2014-01-01'),
        moment('2025-01-01'),
      ]}
      initializeWith={date} />);

    it.only('returns false', () => {
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'returns false');
    });
  });
});

describe('<YearPicker />: handleChange', () => {
  it.only('call `onChange` with { year: number }', () => {
    const date = moment('2015-05-01');
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<YearPicker
      onChange={onChangeFake}
      initializeWith={date} />);
    wrapper.instance().handleChange('click', { value: '2020'});
    const calledWithArgs = onChangeFake.args[0];
    assert(onChangeFake.calledOnce);
    assert.equal(calledWithArgs[0], 'click', 'first argument `click`');
    assert.equal(calledWithArgs[1].value.year, 2020, 'second argument { ..., value: { year: 2020 } }');
  });
});

describe('<YearPicker />: switchToNextPage', () => {
  it.only('shift date 12 years forward', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().switchToNextPage), 'has `switchToNextPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 + 12, '`date` shifted');
  });
});

describe('<YearPicker />: switchToPrevPage', () => {
  it.only('shift date 12 years backward', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = shallow(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().switchToPrevPage), 'has `switchToPrevPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 - 12, '`date` shifted');
  });
});
